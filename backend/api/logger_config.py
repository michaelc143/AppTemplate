"""
logger_config.py
-----------------------------
This module configures the logging for the API.
"""
import logging
from logging.handlers import RotatingFileHandler
import os

LOG_FILE = 'api.log'
LOG_LEVEL = logging.DEBUG
LOG_FORMAT = '%(asctime)s [%(levelname)s] %(name)s: %(message)s'

def setup_logger():
    """ Set up the logger for the API. """
    # Avoid re-adding handlers if already set up
    if len(logging.getLogger().handlers) > 0:
        return

    log_dir = os.path.dirname(LOG_FILE)
    if log_dir and not os.path.exists(log_dir):
        os.makedirs(log_dir)

    handler = RotatingFileHandler(LOG_FILE, maxBytes=1_000_000, backupCount=3, encoding='utf-8')
    handler.setFormatter(logging.Formatter(LOG_FORMAT))

    root_logger = logging.getLogger()
    root_logger.setLevel(LOG_LEVEL)
    root_logger.addHandler(handler)
