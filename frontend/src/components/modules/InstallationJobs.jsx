import React from 'react';
import { Briefcase, Wrench, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const InstallationJobs = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
      <div className="flex items-center mb-8">
        <Briefcase className="h-8 w-8 mr-3 text-orange-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Installation Jobs</h1>
          <p className="text-gray-600">Manage implementation projects and job scheduling</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Active Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">67</p>
            <p className="text-sm text-gray-600">Jobs in progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="h-5 w-5 mr-2" />
              Completed This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">234</p>
            <p className="text-sm text-gray-600">Successful implementations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              On-Time Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">94.7%</p>
            <p className="text-sm text-gray-600">Projects completed on time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstallationJobs;