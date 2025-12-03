"""
Statistics Service - Example implementation

Provides statistical analysis for platform data.
"""

from typing import Dict, List, Any
from datetime import datetime, timedelta
from collections import Counter


class StatisticsService:
    """Service for calculating platform statistics."""
    
    def __init__(self):
        """Initialize statistics service."""
        self.cache = {}
        self.cache_ttl = 300  # 5 minutes
    
    def calculate_demand_stats(self, demands: List[Dict]) -> Dict[str, Any]:
        """
        Calculate statistics for demands.
        
        Args:
            demands: List of demand dictionaries
            
        Returns:
            Dictionary containing demand statistics
        """
        if not demands:
            return {
                'total': 0,
                'by_status': {},
                'by_category': {},
                'completion_rate': 0.0,
                'avg_completion_days': 0,
            }
        
        total = len(demands)
        
        # Status distribution
        status_counts = Counter(d.get('status', 'unknown') for d in demands)
        by_status = dict(status_counts)
        
        # Category distribution
        category_counts = Counter(d.get('category', 'unknown') for d in demands)
        by_category = dict(category_counts)
        
        # Completion rate
        completed = status_counts.get('completed', 0)
        completion_rate = (completed / total * 100) if total > 0 else 0.0
        
        # Average completion time (days)
        # Note: Uses 'completed_at' if available, otherwise falls back to 'updated_at'
        # In production, demands should have a dedicated 'completed_at' timestamp
        completion_days = []
        for demand in demands:
            if demand.get('status') == 'completed':
                created = self._parse_date(demand.get('created_at'))
                # Prefer completed_at over updated_at for accurate timing
                completed_at = self._parse_date(
                    demand.get('completed_at') or demand.get('updated_at')
                )
                if created and completed_at:
                    days = (completed_at - created).days
                    completion_days.append(max(0, days))  # Ensure non-negative
        
        avg_completion_days = (
            sum(completion_days) / len(completion_days) 
            if completion_days else 0
        )
        
        return {
            'total': total,
            'by_status': by_status,
            'by_category': by_category,
            'completion_rate': round(completion_rate, 2),
            'avg_completion_days': round(avg_completion_days, 1),
        }
    
    def calculate_resource_stats(self, resources: List[Dict]) -> Dict[str, Any]:
        """
        Calculate statistics for resources.
        
        Args:
            resources: List of resource dictionaries
            
        Returns:
            Dictionary containing resource statistics
        """
        if not resources:
            return {
                'total': 0,
                'by_type': {},
                'by_status': {},
                'availability_rate': 0.0,
            }
        
        total = len(resources)
        
        # Type distribution
        type_counts = Counter(r.get('type', 'unknown') for r in resources)
        by_type = dict(type_counts)
        
        # Status distribution
        status_counts = Counter(r.get('status', 'unknown') for r in resources)
        by_status = dict(status_counts)
        
        # Availability rate
        available = status_counts.get('available', 0)
        availability_rate = (available / total * 100) if total > 0 else 0.0
        
        return {
            'total': total,
            'by_type': by_type,
            'by_status': by_status,
            'availability_rate': round(availability_rate, 2),
        }
    
    def calculate_user_stats(self, users: List[Dict]) -> Dict[str, Any]:
        """
        Calculate statistics for users.
        
        Args:
            users: List of user dictionaries
            
        Returns:
            Dictionary containing user statistics
        """
        if not users:
            return {
                'total': 0,
                'by_type': {},
                'verified_count': 0,
                'verification_rate': 0.0,
                'total_collaborations': 0,
            }
        
        total = len(users)
        
        # Type distribution
        type_counts = Counter(u.get('type', 'unknown') for u in users)
        by_type = dict(type_counts)
        
        # Verification stats
        verified_count = sum(1 for u in users if u.get('verified', False))
        verification_rate = (verified_count / total * 100) if total > 0 else 0.0
        
        # Total collaborations
        total_collaborations = sum(
            u.get('stats', {}).get('collaborations', 0) for u in users
        )
        
        return {
            'total': total,
            'by_type': by_type,
            'verified_count': verified_count,
            'verification_rate': round(verification_rate, 2),
            'total_collaborations': total_collaborations,
        }
    
    def calculate_platform_overview(
        self, 
        demands: List[Dict], 
        resources: List[Dict], 
        users: List[Dict]
    ) -> Dict[str, Any]:
        """
        Calculate overall platform statistics.
        
        Args:
            demands: List of demand dictionaries
            resources: List of resource dictionaries
            users: List of user dictionaries
            
        Returns:
            Dictionary containing platform overview statistics
        """
        demand_stats = self.calculate_demand_stats(demands)
        resource_stats = self.calculate_resource_stats(resources)
        user_stats = self.calculate_user_stats(users)
        
        return {
            'summary': {
                'total_demands': demand_stats['total'],
                'total_resources': resource_stats['total'],
                'total_users': user_stats['total'],
                'total_collaborations': user_stats['total_collaborations'],
            },
            'demands': demand_stats,
            'resources': resource_stats,
            'users': user_stats,
            'generated_at': datetime.now().isoformat(),
        }
    
    def get_trends(
        self, 
        items: List[Dict], 
        days: int = 30
    ) -> Dict[str, List[int]]:
        """
        Calculate daily trends for the last N days.
        
        Args:
            items: List of items with 'created_at' field
            days: Number of days to analyze
            
        Returns:
            Dictionary with daily counts
        """
        today = datetime.now().date()
        date_range = [(today - timedelta(days=i)) for i in range(days)]
        date_range.reverse()
        
        daily_counts = {d.isoformat(): 0 for d in date_range}
        
        for item in items:
            created = self._parse_date(item.get('created_at'))
            if created:
                date_str = created.date().isoformat()
                if date_str in daily_counts:
                    daily_counts[date_str] += 1
        
        return {
            'dates': list(daily_counts.keys()),
            'counts': list(daily_counts.values()),
        }
    
    def get_top_tags(self, items: List[Dict], limit: int = 10) -> List[Dict]:
        """
        Get most popular tags.
        
        Args:
            items: List of items with 'tags' field
            limit: Maximum number of tags to return
            
        Returns:
            List of tag statistics
        """
        all_tags = []
        for item in items:
            tags = item.get('tags', [])
            if isinstance(tags, list):
                all_tags.extend(tags)
        
        tag_counts = Counter(all_tags)
        top_tags = tag_counts.most_common(limit)
        
        return [{'tag': tag, 'count': count} for tag, count in top_tags]
    
    @staticmethod
    def _parse_date(date_str: str) -> datetime:
        """Parse date string to datetime object."""
        if not date_str:
            return None
        
        formats = [
            '%Y-%m-%dT%H:%M:%SZ',
            '%Y-%m-%dT%H:%M:%S',
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%d',
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue
        
        return None
