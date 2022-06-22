import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Optional,
  PipeTransform,
  ValidationPipeOptions,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { ClassTransformOptions, instanceToPlain, plainToClass } from 'class-transformer';
import { ValidatorOptions, validate } from 'class-validator';

/**
 * Pipe for validating the body of a request.
 *
 * details：
 * @see https://github.com/typestack/class-validator#validation-groups
 *      https://docs.nestjs.com/techniques/validation
 */
@Injectable()
export class ParameterValidationPipe implements PipeTransform {
  protected isTransformEnabled: boolean;
  protected isDetailedOutputDisabled: boolean;
  protected validatorOptions: ValidatorOptions;

  constructor(@Optional() options?: ValidationPipeOptions) {
    // tslint:disable-next-line:no-parameter-reassignment
    options = options || {};
    const { transform, disableErrorMessages, ...validatorOptions } = options;
    this.isTransformEnabled = !!transform;
    this.validatorOptions = validatorOptions;
    this.isDetailedOutputDisabled = disableErrorMessages;
  }

  async transform(entity: any, metadata: ArgumentMetadata) {
    const { metatype, type } = metadata;
    if (!metatype || !this.toValidate(metadata)) return entity;
    const transformOptions: ClassTransformOptions = {
      excludePrefixes: ['__'],
    };

    // NOTE: Get current validateGroups
    if (entity.__validateGroups) {
      this.validatorOptions.groups = entity.__validateGroups;
      transformOptions.groups = entity.__validateGroups;
    }

    // NOTE: Map to specified data type
    const entityClass = plainToClass(
      metatype,
      this.trim(ParameterValidationPipe.toEmptyIfNil(entity), type),
      transformOptions,
    );

    // NOTE: Validate
    const errors = await validate(entityClass, this.validatorOptions);
    if (errors.length > 0) {
      // NOTE: Throw exception
      throw new BadRequestException(errors);
    }
    return this.isTransformEnabled
      ? entityClass
      : Object.keys(this.validatorOptions).length > 0
      ? instanceToPlain(metadata)
      : entity;
  }

  private toValidate({ metatype, type }: ArgumentMetadata): boolean {
    if (type === 'custom') return false;
    const types = [String, Boolean, Number, Array, Object];
    return (
      !types.some(itemType => {
        metatype === itemType;
      }) && !isNil(metatype)
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private static toEmptyIfNil<T, R>(value: T): R | {} {
    return isNil(value) ? {} : value;
  }

  private isObj(value: any): boolean {
    return typeof value === 'object' && value != null;
  }

  // NOTE: Trim for String type properties
  private trim<T>(value: T, type: string): T {
    if (type === 'body') {
      Object.keys(value).forEach(key => {
        if (this.isObj(value[key])) {
          value[key] = this.trim(value[key], type);
        } else {
          if (typeof value[key] === 'string') {
            value[key] = value[key].trim();
          }
        }
      });
    }
    return value;
  }
}
