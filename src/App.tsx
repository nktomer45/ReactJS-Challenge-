
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Dimensions1 from "./pages/Dimensions1";
import Dimensions2 from "./pages/Dimensions2";
import DataEntry from "./pages/DataEntry";
import ChartView from "./pages/ChartView";
import NotFound from "./pages/NotFound";
import CustomNavbar from "./components/layout/CustomNavbar";
import Sidebar from "./components/layout/Sidebar";
import { useIsMobile } from "./hooks/use-mobile";

const queryClient = new QueryClient();

const App = () => {
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" expand closeButton theme="light" richColors />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <CustomNavbar />
            <div className="flex flex-1">
              <Sidebar />
              {/* Main content with responsive padding */}
              <main className={`flex-1 overflow-auto ${isMobile ? 'pl-0' : 'pl-[240px]'}`}>
                <div className="w-full max-w-7xl mx-auto px-4 py-6">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/dimensions1" element={<Dimensions1 />} />
                      <Route path="/dimensions2" element={<Dimensions2 />} />
                      <Route path="/data-entry" element={<DataEntry />} />
                      <Route path="/chart-view" element={<ChartView />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AnimatePresence>
                </div>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
