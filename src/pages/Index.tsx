
import { motion } from 'framer-motion';
import { ArrowRightIcon, Database, BarChart3, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';

const features = [
  {
    title: 'Dimension Management',
    description: 'Create and manage dimensions that define your data structure',
    icon: Database,
    color: 'bg-blue-500',
    link: '/dimensions1'
  },
  {
    title: 'Interactive Data Grid',
    description: 'Enter, analyze and format data with conditional highlighting',
    icon: LayoutDashboard,
    color: 'bg-purple-500',
    link: '/data-entry'
  },
  {
    title: 'Visual Analytics',
    description: 'Transform your data into powerful visual insights',
    icon: BarChart3,
    color: 'bg-emerald-500',
    link: '/chart-view'
  }
];

const Index = () => {
  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="container py-24 px-4 mx-auto">
          <section className="max-w-5xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <Badge className="px-3 py-1 text-sm" variant="outline">
                Data Dimensions Magic
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
                Analyze & Visualize Data
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                A powerful yet simple platform for manipulating, analyzing, and visualizing your dimensional data with elegant interactions.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Button asChild size="lg" className="rounded-full btn-hover-effect">
                  <Link to="/dimensions1">
                    Get Started
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </section>

          <section className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 + 0.3 }}
                >
                  <Card className="glass h-full shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
                    <CardHeader>
                      <div className={`${feature.color} w-12 h-12 rounded-full flex items-center justify-center text-white mb-4`}>
                        <feature.icon size={20} />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="ghost" asChild className="group">
                        <Link to={feature.link} className="flex items-center">
                          Explore
                          <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </PageTransition>
    </>
  );
};

export default Index;
