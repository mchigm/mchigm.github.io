"""
Analytics module for the MCHIGM platform

This module provides data analysis and statistics functionality.
"""

from .statistics import StatisticsService
from .reports import ReportGenerator

__all__ = ['StatisticsService', 'ReportGenerator']
