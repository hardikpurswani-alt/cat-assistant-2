import logging
import re
from typing import Any

# Patterns to mask in logs
SENSITIVE_PATTERNS = [
    (re.compile(r'("password"|"token"|"api_key"|"secret"|"authorization"):\s*"[^"]+"', re.IGNORECASE), r'\1: "[REDACTED]"'),
    (re.compile(r'(Bearer\s+)[A-Za-z0-9\-\._~\+\/]+=*', re.IGNORECASE), r'\1[REDACTED]'),
]


class SensitiveDataFilter(logging.Filter):
    """Filters out passwords, JWT tokens, and API credentials from application logs."""

    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.msg, str):
            for pattern, replacement in SENSITIVE_PATTERNS:
                record.msg = pattern.sub(replacement, record.msg)
        return True


def setup_logging() -> None:
    """Configures application-wide logging with privacy filters."""
    root_logger = logging.getLogger()
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)
    handler.addFilter(SensitiveDataFilter())

    # Avoid duplicate handlers
    if not root_logger.handlers:
        root_logger.addHandler(handler)
        root_logger.setLevel(logging.INFO)
