"""
MCHIGM Platform - Python Backend Service

Main entry point for Python-based services including:
- Data analytics
- Automation tasks
- Machine learning models
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration - read from environment
DEBUG_MODE = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
app.config['DEBUG'] = DEBUG_MODE
app.config['JSON_AS_ASCII'] = False


@app.route('/')
def index():
    """Root endpoint"""
    return jsonify({
        'code': 200,
        'message': 'MCHIGM Python Service',
        'version': 'v1.0.0',
        'status': 'running'
    })


@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'code': 200,
        'message': 'success',
        'data': {
            'status': 'healthy',
            'timestamp': datetime.now().isoformat()
        }
    })


@app.route('/api/analytics/test')
def analytics_test():
    """Test analytics endpoint"""
    return jsonify({
        'code': 200,
        'message': 'Analytics service working',
        'data': {
            'service': 'analytics',
            'timestamp': datetime.now().isoformat()
        }
    })


@app.route('/api/automation/test')
def automation_test():
    """Test automation endpoint"""
    return jsonify({
        'code': 200,
        'message': 'Automation service working',
        'data': {
            'service': 'automation',
            'timestamp': datetime.now().isoformat()
        }
    })


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'code': 404,
        'message': 'Endpoint not found',
        'path': request.path
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'code': 500,
        'message': 'Internal server error',
        'error': str(error)
    }), 500


if __name__ == '__main__':
    print('Starting MCHIGM Python Service...')
    print('Server running on http://127.0.0.1:8001')
    # Only enable debug mode if explicitly set in environment
    app.run(host='127.0.0.1', port=8001, debug=DEBUG_MODE)
