import api from './api';

class AnalyticsService {
    getAnalyticsSummary() {
        return api.get('/analytics/summary');
    }
}

export default new AnalyticsService();
