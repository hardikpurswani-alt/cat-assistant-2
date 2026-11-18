from typing import Any, Optional
from fastapi import HTTPException, status


class CBTAppException(HTTPException):
    def __init__(
        self,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        detail: str = "An error occurred",
        code: str = "APP_ERROR",
        extra: Optional[Any] = None,
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.code = code
        self.extra = extra


class AuthenticationError(CBTAppException):
    def __init__(self, detail: str = "Invalid credentials", code: str = "AUTH_FAILED"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            code=code,
        )


class EntityNotFoundError(CBTAppException):
    def __init__(self, entity_name: str = "Resource", entity_id: Any = None):
        detail = f"{entity_name} not found"
        if entity_id is not None:
            detail += f" with id '{entity_id}'"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            code="NOT_FOUND",
        )


class PermissionDeniedError(CBTAppException):
    def __init__(self, detail: str = "Access denied to this resource"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            code="FORBIDDEN",
        )


class ConflictError(CBTAppException):
    def __init__(self, detail: str = "Resource already exists"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
            code="CONFLICT",
        )
