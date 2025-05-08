import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowUp, ArrowDown, Minus, Play } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  text: string;
  summary: string;
  url: string;
  image: string;
  video: string | null;
  publish_date: string;
  author: string | null;
  authors?: string[];
  language: string;
  category: string;
  source_country: string;
  sentiment: number;
}

interface NewsResponse {
  offset: number;
  number: number;
  available: number;
  news: NewsItem[];
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://mern-backend-166800957423.us-central1.run.app";
  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get<NewsResponse>(
        `${API_BASE_URL}/api/news/finance-india`
      );
      setNews(response.data.news);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError(
        "Failed to fetch the latest financial news. Please try again later."
      );

      // Fallback to sample data in development
      if (process.env.NODE_ENV === "development") {
        setNews(sampleNews);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNews = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setModalOpen(true);
    setAiSummary(null); // Reset any previous AI summary
    setPlaying(false); // Reset video playing state
  };

  const handleGenerateAISummary = async () => {
    if (!selectedNews) return;

    setSummarizing(true);
    try {
      const response = await axios.post(`/api/news/summarize`, {
        text: selectedNews.text,
        title: selectedNews.title,
      });
      setAiSummary(response.data.summary);
    } catch (err) {
      console.error("Failed to generate AI summary:", err);
      setAiSummary("Sorry, we couldn't generate a summary at this time.");
    } finally {
      setSummarizing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment > 0.2) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (sentiment < -0.2) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-yellow-500" />;
  };

  const getSentimentClass = (sentiment: number) => {
    if (sentiment > 0.2)
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (sentiment < -0.2)
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  };

  const getAuthorDisplay = (item: NewsItem) => {
    if (item.authors && item.authors.length > 0) {
      return item.authors.join(", ");
    }
    return item.author || "Unknown";
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Indian Financial News</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && news.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Error Loading News</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={fetchNews}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Indian Financial News</h1>
        <Button onClick={fetchNews} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <Card
            key={item.id || index}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleOpenNews(item)}
          >
            <div className="relative">
              {item.image ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/600x400/e2e8f0/64748b?text=Finance+News";
                    }}
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    No image available
                  </span>
                </div>
              )}
              {item.video && (
                <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full">
                  <Play className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg line-clamp-2">
                  {item.title}
                </CardTitle>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(item.publish_date)}
                </p>
                <Badge
                  variant="outline"
                  className={getSentimentClass(item.sentiment)}
                >
                  <span className="flex items-center gap-1">
                    {getSentimentIcon(item.sentiment)}
                    {item.sentiment.toFixed(2)}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {item.summary || item.text.substring(0, 150) + "..."}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Badge variant="secondary">{getAuthorDisplay(item)}</Badge>
              {item.video && <Badge variant="outline">Video Available</Badge>}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* News Detail Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedNews?.title}</DialogTitle>
            <DialogDescription className="flex justify-between items-center">
              <span>
                {selectedNews && getAuthorDisplay(selectedNews)} •{" "}
                {selectedNews && formatDate(selectedNews.publish_date)}
              </span>
              {selectedNews && (
                <Badge
                  variant="outline"
                  className={getSentimentClass(selectedNews.sentiment)}
                >
                  <span className="flex items-center gap-1">
                    {getSentimentIcon(selectedNews.sentiment)}
                    Sentiment: {selectedNews.sentiment.toFixed(2)}
                  </span>
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedNews?.image && (
            <div className="my-4">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-auto rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          {selectedNews?.video && (
            <div className="my-4">
              {playing ? (
                <video
                  src={selectedNews.video}
                  controls
                  autoPlay
                  className="w-full rounded-md"
                ></video>
              ) : (
                <div className="relative">
                  {selectedNews.image ? (
                    <img
                      src={selectedNews.image}
                      alt={selectedNews.title}
                      className="w-full rounded-md cursor-pointer"
                    />
                  ) : (
                    <div className="bg-gray-200 dark:bg-gray-800 h-64 rounded-md"></div>
                  )}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md cursor-pointer"
                    onClick={() => setPlaying(true)}
                  >
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-4">
                      <Play className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="my-4">
            <p className="text-gray-700 dark:text-gray-300">
              {selectedNews?.text}
            </p>
          </div>

          {/* Show API-provided summary if available, otherwise show AI summary */}
          {/* Show API-provided summary if available */}
          {selectedNews?.summary && (
            <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center mb-2">
                <Sparkles className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                  Article Summary
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedNews.summary}
              </p>
            </div>
          )}

          {/* Always show AI summary when available */}
          {aiSummary && (
            <div className="my-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center mb-2">
                <Sparkles className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-indigo-800 dark:text-indigo-300">
                  Enhanced AI Summary
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{aiSummary}</p>
            </div>
          )}

          <DialogFooter className="flex gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => window.open(selectedNews?.url, "_blank")}
            >
              Read Full Article
            </Button>

            {/* Always show AI summary button regardless of API summary */}
            <Button
              onClick={handleGenerateAISummary}
              disabled={summarizing || !!aiSummary}
              className="gap-2"
            >
              {summarizing ? (
                <>
                  <span className="animate-spin mr-2">⊛</span>
                  Generating...
                </>
              ) : aiSummary ? (
                "AI Summary Generated"
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Enhanced AI Summary
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sample news data for development/fallback - updated to match new API format
const sampleNews = [
  {
    id: 318664776,
    title: "Welspun Corp secures Rs 1,950 crore order for pipe, bend supply",
    text: "Homegrown Welspun Corp Ltd (WCL) has secured an export order worth Rs 1,950 crore for the supply of line pipes and bends. With these new orders, its current consolidated global order book stands at around Rs 19,300 crore, the company said.",
    summary:
      "Welspun Corp Ltd has secured a significant export order valued at Rs 1,950 crore for the supply of line pipes and bends, boosting its consolidated global order book to approximately Rs 19,300 crore.",
    url: "https://economictimes.indiatimes.com/industry/indl-goods/svs/steel/welspun-corp-secures-rs-1950-crore-order-for-pipe-bend-supply/articleshow/120954268.cms",
    image:
      "https://img.etimg.com/thumb/msid-120954340,resizemode-4,width-1200,height-900,imgsize-134494,overlay-economictimes/articleshow.jpg",
    video: null,
    publish_date: "2025-05-07 05:54:44",
    author: null,
    language: "en",
    category: "business",
    source_country: "in",
    sentiment: 0.483,
  },
  {
    id: 308502330,
    title: "Top 5 Biggest Stock Market Crashes In India's History",
    text: "The Global Financial Crisis (2008): The collapse of Lehman Brothers, one of the largest US investment bankers, and the US subprime crisis triggered a recession at the global level.",
    summary:
      "As India and global markets are mired in turmoil over fears of an escalating global trade war triggered by US President Donald Trump's tariff policies, here's a look back at the worst stock market crashes in India.",
    url: "https://www.news18.com/photogallery/business/top-5-biggest-stock-market-crashes-in-indias-history-9289876.html",
    image: "",
    video: null,
    publish_date: "2025-04-07 09:25:00",
    author: "News18",
    authors: ["News18"],
    language: "en",
    category: "business",
    source_country: "in",
    sentiment: -0.172,
  },
];

export default News;
