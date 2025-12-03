"""
Report Generator - Example implementation

Generates various reports for the platform.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
import json


class ReportGenerator:
    """Service for generating platform reports."""
    
    def __init__(self, statistics_service=None):
        """
        Initialize report generator.
        
        Args:
            statistics_service: Optional StatisticsService instance
        """
        self.statistics_service = statistics_service
    
    def generate_summary_report(
        self,
        demands: List[Dict],
        resources: List[Dict],
        users: List[Dict],
        title: str = "平台概览报告"
    ) -> Dict[str, Any]:
        """
        Generate a summary report of platform activity.
        
        Args:
            demands: List of demand dictionaries
            resources: List of resource dictionaries
            users: List of user dictionaries
            title: Report title
            
        Returns:
            Report dictionary
        """
        # Calculate basic metrics
        total_demands = len(demands)
        total_resources = len(resources)
        total_users = len(users)
        
        active_demands = sum(
            1 for d in demands 
            if d.get('status') in ['open', 'in_progress']
        )
        available_resources = sum(
            1 for r in resources 
            if r.get('status') == 'available'
        )
        verified_users = sum(
            1 for u in users 
            if u.get('verified', False)
        )
        
        return {
            'title': title,
            'generated_at': datetime.now().isoformat(),
            'summary': {
                'total_demands': total_demands,
                'active_demands': active_demands,
                'total_resources': total_resources,
                'available_resources': available_resources,
                'total_users': total_users,
                'verified_users': verified_users,
            },
            'metrics': {
                'demand_activity_rate': self._calculate_rate(active_demands, total_demands),
                'resource_availability_rate': self._calculate_rate(available_resources, total_resources),
                'user_verification_rate': self._calculate_rate(verified_users, total_users),
            },
        }
    
    def generate_category_report(
        self,
        demands: List[Dict],
        title: str = "需求分类报告"
    ) -> Dict[str, Any]:
        """
        Generate a report by demand categories.
        
        Args:
            demands: List of demand dictionaries
            title: Report title
            
        Returns:
            Report dictionary
        """
        categories = {}
        
        for demand in demands:
            category = demand.get('category', '未分类')
            if category not in categories:
                categories[category] = {
                    'total': 0,
                    'open': 0,
                    'in_progress': 0,
                    'completed': 0,
                    'closed': 0,
                }
            
            categories[category]['total'] += 1
            status = demand.get('status', 'unknown')
            if status in categories[category]:
                categories[category][status] += 1
        
        # Sort by total count
        sorted_categories = dict(
            sorted(categories.items(), key=lambda x: x[1]['total'], reverse=True)
        )
        
        return {
            'title': title,
            'generated_at': datetime.now().isoformat(),
            'total_demands': len(demands),
            'categories': sorted_categories,
            'category_count': len(sorted_categories),
        }
    
    def generate_user_activity_report(
        self,
        users: List[Dict],
        title: str = "用户活跃度报告"
    ) -> Dict[str, Any]:
        """
        Generate a report on user activity.
        
        Args:
            users: List of user dictionaries
            title: Report title
            
        Returns:
            Report dictionary
        """
        user_types = {}
        total_demands_posted = 0
        total_resources_provided = 0
        total_collaborations = 0
        
        for user in users:
            user_type = user.get('type', 'unknown')
            stats = user.get('stats', {})
            
            if user_type not in user_types:
                user_types[user_type] = {
                    'count': 0,
                    'demands_posted': 0,
                    'resources_provided': 0,
                    'collaborations': 0,
                }
            
            user_types[user_type]['count'] += 1
            user_types[user_type]['demands_posted'] += stats.get('demands_posted', 0)
            user_types[user_type]['resources_provided'] += stats.get('resources_provided', 0)
            user_types[user_type]['collaborations'] += stats.get('collaborations', 0)
            
            total_demands_posted += stats.get('demands_posted', 0)
            total_resources_provided += stats.get('resources_provided', 0)
            total_collaborations += stats.get('collaborations', 0)
        
        # Calculate averages
        total_users = len(users)
        avg_demands = total_demands_posted / total_users if total_users > 0 else 0
        avg_resources = total_resources_provided / total_users if total_users > 0 else 0
        avg_collaborations = total_collaborations / total_users if total_users > 0 else 0
        
        return {
            'title': title,
            'generated_at': datetime.now().isoformat(),
            'total_users': total_users,
            'user_types': user_types,
            'totals': {
                'demands_posted': total_demands_posted,
                'resources_provided': total_resources_provided,
                'collaborations': total_collaborations,
            },
            'averages': {
                'demands_per_user': round(avg_demands, 2),
                'resources_per_user': round(avg_resources, 2),
                'collaborations_per_user': round(avg_collaborations, 2),
            },
        }
    
    def generate_matching_report(
        self,
        demands: List[Dict],
        resources: List[Dict],
        matches: Optional[List[Dict]] = None,
        title: str = "匹配分析报告"
    ) -> Dict[str, Any]:
        """
        Generate a report on demand-resource matching.
        
        Args:
            demands: List of demand dictionaries
            resources: List of resource dictionaries
            matches: Optional list of match results
            title: Report title
            
        Returns:
            Report dictionary
        """
        active_demands = [d for d in demands if d.get('status') in ['open', 'in_progress']]
        available_resources = [r for r in resources if r.get('status') == 'available']
        
        # Analyze tag overlap
        demand_tags = set()
        for d in active_demands:
            demand_tags.update(d.get('tags', []))
        
        resource_tags = set()
        for r in available_resources:
            resource_tags.update(r.get('tags', []))
        
        common_tags = demand_tags.intersection(resource_tags)
        
        return {
            'title': title,
            'generated_at': datetime.now().isoformat(),
            'active_demands': len(active_demands),
            'available_resources': len(available_resources),
            'tag_analysis': {
                'demand_tags_count': len(demand_tags),
                'resource_tags_count': len(resource_tags),
                'common_tags_count': len(common_tags),
                'common_tags': list(common_tags)[:20],  # Top 20 common tags
            },
            'potential_match_rate': self._calculate_rate(len(common_tags), len(demand_tags)),
            'matches_provided': len(matches) if matches else 0,
        }
    
    def export_to_json(self, report: Dict[str, Any], filepath: str) -> bool:
        """
        Export report to JSON file.
        
        Args:
            report: Report dictionary
            filepath: Output file path
            
        Returns:
            True if successful
        """
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
            return True
        except IOError:
            return False
    
    @staticmethod
    def _calculate_rate(numerator: int, denominator: int) -> float:
        """Calculate percentage rate."""
        if denominator == 0:
            return 0.0
        return round((numerator / denominator) * 100, 2)
