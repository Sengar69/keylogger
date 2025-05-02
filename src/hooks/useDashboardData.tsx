import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface KeystrokeLog {
  id: string;
  timestamp: string;
  keystrokes: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  country: string;
  region: string;
  ip_address: string;
  city?: string;
}

export interface KeyFrequency {
  key: string;
  count: number;
}

interface UseDashboardDataProps {
  autoRefresh: boolean;
}

interface DashboardData {
  logs: KeystrokeLog[];
  keyFrequency: KeyFrequency[];
  isLoading: boolean;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
}

// The base URL for API requests
const API_BASE_URL = "http://localhost:8080";

const useDashboardData = ({ autoRefresh }: UseDashboardDataProps): DashboardData => {
  const [logs, setLogs] = useState<KeystrokeLog[]>([]);
  const [keyFrequency, setKeyFrequency] = useState<KeyFrequency[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  // Function to generate mock data for development when API is not available
  const useMockData = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_DATA === "true";

  const generateMockLogs = (): KeystrokeLog[] => {
    const sentiments = ["Positive", "Negative", "Neutral"];
    const countries = ["United States", "Germany", "Japan", "Brazil", "India"];
    const regions = ["California", "Bavaria", "Tokyo", "Sao Paulo", "Maharashtra"];
    const cities = ["San Francisco", "Munich", "Tokyo", "Sao Paulo", "Mumbai"];
    
    return Array(20).fill(0).map((_, index) => {
      const sentimentIndex = Math.floor(Math.random() * 3);
      const countryIndex = Math.floor(Math.random() * 5);
      return {
        id: `log-${index}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        keystrokes: `Sample text entry ${index + 1}`,
        sentiment: sentiments[sentimentIndex] as "Positive" | "Negative" | "Neutral",
        country: countries[countryIndex],
        region: regions[countryIndex],
        city: cities[countryIndex],
        ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      };
    });
  };

  const generateMockKeyFrequency = (): KeyFrequency[] => {
    const keys = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
    return keys.slice(0, 20).map((key) => ({
      key,
      count: Math.floor(Math.random() * 100) + 1
    })).sort((a, b) => b.count - a.count);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (useMockData) {
        // Use mock data for development
        setLogs(generateMockLogs());
        setKeyFrequency(generateMockKeyFrequency());
      } else {
        // Fetch real data from API
        const [logsResponse, keyFreqResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/logs`),
          fetch(`${API_BASE_URL}/api/key_freq`)
        ]);
        
        if (!logsResponse.ok || !keyFreqResponse.ok) {
          throw new Error('Failed to fetch data from API');
        }
        
        const logsData = await logsResponse.json();
        const keyFreqData = await keyFreqResponse.json();
        
        setLogs(logsData);
        setKeyFrequency(keyFreqData);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error fetching data",
        description: "Could not load the latest keystroke data. Please check if the server is running.",
        variant: "destructive"
      });
      
      // Fallback to mock data if API fetch fails and we're not already using mock data
      if (!useMockData) {
        setLogs(generateMockLogs());
        setKeyFrequency(generateMockKeyFrequency());
        toast({
          title: "Using mock data",
          description: "Displaying mock data since API is unavailable.",
          variant: "default"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, useMockData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [autoRefresh, fetchData]);

  return {
    logs,
    keyFrequency,
    isLoading,
    lastUpdated,
    refreshData: fetchData
  };
};

export default useDashboardData;
