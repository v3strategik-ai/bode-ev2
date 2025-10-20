import React, { useState } from 'react';
import { Zap, Plus, Search, Filter, MapPin, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const products = [
    {
      id: 'EV150',
      name: 'MATIKAI FastCharge Pro 150kW',
      category: 'DC Fast Charger',
      status: 'available',
      power: '150kW',
      connectors: 'CCS1/CCS2/CHAdeMO',
      price: '$45,000',
      inStock: 23,
      monthsSold: 156
    },
    {
      id: 'EV250', 
      name: 'MATIKAI UltraCharge 250kW',
      category: 'DC Ultra Fast',
      status: 'available',
      power: '250kW',
      connectors: 'CCS1/CCS2',
      price: '$78,000',
      inStock: 12,
      monthsSold: 89
    },
    {
      id: 'EV50',
      name: 'MATIKAI SmartCharge AC 22kW',
      category: 'AC Level 2',
      status: 'backorder',
      power: '22kW',
      connectors: 'Type 1/Type 2',
      price: '$8,500',
      inStock: 0,
      monthsSold: 234
    },
    {
      id: 'EV350',
      name: 'MATIKAI HyperCharge 350kW',
      category: 'DC Ultra Fast',
      status: 'preorder',
      power: '350kW',
      connectors: 'CCS1/CCS2',
      price: '$125,000',
      inStock: 5,
      monthsSold: 12
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'backorder': return 'bg-yellow-100 text-yellow-800';
      case 'preorder': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />;
      case 'backorder': return <AlertCircle className="h-4 w-4" />;
      case 'preorder': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Zap className="h-8 w-8 mr-3 text-green-600" />
            Product Catalog
          </h1>
          <p className="text-gray-600 mt-2">Browse and manage EV charging station products</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Export Catalog
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">47</p>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-3xl font-bold text-green-600">40</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Backorders</p>
                <p className="text-3xl font-bold text-yellow-600">7</p>
              </div>
              <Activity className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Units Sold (MTD)</p>
                <p className="text-3xl font-bold text-blue-600">491</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="backorder">Backorder</option>
          <option value="preorder">Pre-order</option>
        </select>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Product</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Power</th>
                  <th className="text-left py-3 px-4 font-semibold">Price</th>
                  <th className="text-left py-3 px-4 font-semibold">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold">Sold (MTD)</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                        <div className="text-xs text-gray-400">SKU: {product.id}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`flex items-center space-x-1 ${getStatusColor(product.status)}`}>
                        {getStatusIcon(product.status)}
                        <span className="capitalize">{product.status}</span>
                      </Badge>
                    </td>
                    <td className="py-4 px-4 font-medium">{product.power}</td>
                    <td className="py-4 px-4 font-semibold text-green-600">{product.price}</td>
                    <td className="py-4 px-4">
                      <span className={`font-medium ${product.inStock > 10 ? 'text-green-600' : product.inStock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {product.inStock} units
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium">{product.monthsSold}</td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" className="bg-blue-600">Quote</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCatalog;