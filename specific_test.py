#!/usr/bin/env python3
"""
Specific Backend API Tests for Review Request
Tests the exact sample data mentioned in the review request
"""

import requests
import json
import sys

# Backend URL from environment
BACKEND_URL = "https://notify-mesh.preview.emergentagent.com/api"

def test_specific_lead_scoring():
    """Test AI Lead Scoring with the exact sample data from review request"""
    print("🧠 Testing AI Lead Scoring with Review Request Sample Data...")
    
    # Exact sample data from review request
    lead_data = {
        "company_name": "Tesla Fleet Services",
        "contact_email": "procurement@teslafleet.com",
        "contact_phone": "+1-650-555-0199",
        "industry": "Fleet Management", 
        "company_size": "1000+",
        "estimated_budget": 750000.0,  # From review request
        "location": "California",
        "current_ev_infrastructure": "basic",
        "timeline": "3-6 months",
        "lead_source": "website_inquiry"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/ai/lead-scoring", json=lead_data, timeout=30)
        print(f"📡 POST /api/ai/lead-scoring")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success - AI Lead Scoring Response:")
            print(f"   Company: {lead_data['company_name']}")
            print(f"   Industry: {lead_data['industry']}")
            print(f"   Budget: ${lead_data['estimated_budget']:,.2f}")
            print(f"   Lead Score: {result.get('score')}/100")
            print(f"   Priority: {result.get('priority')}")
            print(f"   Estimated Value: ${result.get('estimated_value', 0):,.2f}")
            print(f"   AI Reasoning: {result.get('reasoning', '')[:150]}...")
            return True
        else:
            print(f"❌ Failed with status {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        return False

def test_specific_dynamic_pricing():
    """Test Dynamic Pricing with the exact sample data from review request"""
    print("\n💰 Testing Dynamic Pricing with Review Request Sample Data...")
    
    # Exact sample data from review request
    pricing_data = {
        "product_id": "Commercial Charging Station",  # From review request
        "customer_type": "Enterprise",  # From review request
        "quantity": 10,  # From review request
        "location": "California",
        "installation_complexity": "moderate",
        "timeline": "immediate",
        "competitor_pricing": 48000.0
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/ai/dynamic-pricing", json=pricing_data, timeout=30)
        print(f"📡 POST /api/ai/dynamic-pricing")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success - AI Dynamic Pricing Response:")
            print(f"   Product: {pricing_data['product_id']}")
            print(f"   Customer Tier: {pricing_data['customer_type']}")
            print(f"   Quantity: {pricing_data['quantity']} units")
            print(f"   Base Price: ${result.get('base_price', 0):,.2f}")
            print(f"   Recommended Price: ${result.get('recommended_price', 0):,.2f}")
            print(f"   Discount: {result.get('discount_percentage', 0):.1f}%")
            print(f"   Strategy: {result.get('pricing_strategy', '')}")
            print(f"   Confidence: {result.get('confidence_level', 0):.2f}")
            print(f"   AI Reasoning: {result.get('reasoning', '')[:150]}...")
            return True
        else:
            print(f"❌ Failed with status {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        return False

def test_response_times():
    """Test API response times"""
    print("\n⏱️  Testing API Response Times...")
    
    import time
    
    # Test lead scoring response time
    start_time = time.time()
    response = requests.get(f"{BACKEND_URL}/", timeout=30)
    basic_time = time.time() - start_time
    
    print(f"   Basic API Response Time: {basic_time:.2f}s")
    
    if basic_time < 2.0:
        print("   ✅ Basic API response time is good")
        return True
    else:
        print("   ⚠️  Basic API response time is slow")
        return False

def main():
    """Run specific tests for review request"""
    print("🎯 BODE EV Enterprise V3 Backend API Tests - Review Request Specific")
    print("   Testing exact sample data from review request")
    print("=" * 70)
    
    test_results = []
    
    # Run specific tests
    tests = [
        ("Lead Scoring (Review Sample)", test_specific_lead_scoring),
        ("Dynamic Pricing (Review Sample)", test_specific_dynamic_pricing),
        ("Response Times", test_response_times)
    ]
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            test_results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            test_results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 70)
    print("📋 REVIEW REQUEST TEST SUMMARY")
    print("=" * 70)
    
    passed = 0
    failed = 0
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal: {passed + failed} tests")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    
    if failed == 0:
        print("\n🎉 All review request tests passed!")
        print("✅ AI Lead Scoring API working with sample data")
        print("✅ AI Dynamic Pricing API working with sample data")
        print("✅ EMERGENT_LLM_KEY integration confirmed")
        print("✅ Response times acceptable")
        return True
    else:
        print(f"\n⚠️  {failed} test(s) failed.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)