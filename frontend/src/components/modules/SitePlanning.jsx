import React from 'react';
import { Target, MapPin, Ruler } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const SitePlanning = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
      <div className="flex items-center mb-8">
        <Target className="h-8 w-8 mr-3 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Planning</h1>
          <p className="text-gray-600">Strategic site selection and implementation planning</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">23</p>
            <p className="text-sm text-gray-600">Sites in planning phase</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ruler className="h-5 w-5 mr-2" />
              Site Surveys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">156</p>
            <p className="text-sm text-gray-600">Completed this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Approval Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">89.2%</p>
            <p className="text-sm text-gray-600">Planning approval rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SitePlanning;