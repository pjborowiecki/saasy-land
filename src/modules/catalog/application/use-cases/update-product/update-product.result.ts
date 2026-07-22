import type { ProductDto } from "~/src/modules/catalog/application/dto/product.dto"
import type { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"
import type { Result } from "~/src/modules/shared-kernel/domain/types/result"

export type UpdateProductResult = Result<ProductDto, DomainError>
