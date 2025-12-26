import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useThemeStore } from "../hooks/useTheme";
import {
  ArrowRight,
  Code,
  Github,
  Moon,
  Sun,
  Brush,
  Users,
  Shield,
  Cloud,
  Palette,
  Zap,
  Layers,
  Bolt as Flash,
  Database
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { effectiveTheme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                M
              </div>
              <span className="text-xl font-bold tracking-tight">Maplify Tech</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                Features
              </a>
              <a href="#about" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                Documentation
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                Pricing
              </a>
              <div className="flex items-center gap-4">
                <a href="https://github.com/rakesh-kadam/maplify-tech" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <button
                  onClick={toggleTheme}
                  className="bg-secondary p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  {effectiveTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden hero-pattern">
        {/* Gradient blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 dark:bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Now available: v2.0 with Real-time Sync
          </div>

          {/* Hero Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Your Self-Hosted <br />
            <span className="gradient-text">Collaborative Whiteboard</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Create, collaborate, and visualize ideas with a powerful, privacy-focused platform. Built on Excalidraw, designed for teams who value data ownership and speed.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="group relative px-8 py-6 text-base font-semibold shadow-lg hover:shadow-primary/30 transition-all duration-200"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="px-8 py-6 text-base font-medium"
            >
              <a href="https://github.com/rakesh-kadam/maplify-tech" target="_blank" rel="noopener noreferrer">
                <Code className="mr-2 h-5 w-5" />
                View on GitHub
              </a>
            </Button>
          </div>

          {/* Hero Mockup */}
          <div className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-border bg-card/50 shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Window controls */}
            <div className="absolute top-0 w-full h-11 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>

            {/* Canvas mockup */}
            <div className="pt-11 p-4 md:p-8 h-[400px] md:h-[500px] flex items-center justify-center bg-background/50">
              <div className="text-muted-foreground text-center">
                <Brush className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Your canvas awaits...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-semibold text-primary tracking-wide uppercase">Capabilities</h2>
            <p className="mt-2 text-3xl font-extrabold sm:text-4xl">Everything you need to visualize.</p>
            <p className="mt-4 text-xl text-muted-foreground">Robust tools wrapped in a minimal interface. Focus on your ideas, not the tool.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Brush, title: "Powerful Drawing Tools", desc: "Create diagrams, flowcharts, wireframes, and freehand sketches with an intuitive interface that feels natural.", color: "blue" },
              { icon: Users, title: "Real-Time Collaboration", desc: "Work together with your team in real-time. See live cursors, instant updates, and resolve conflicts automatically.", color: "purple" },
              { icon: Shield, title: "Self-Hosted Privacy", desc: "Your data stays on your infrastructure. Full control over security, compliance, and where your whiteboard data lives.", color: "green" },
              { icon: Cloud, title: "Cloud Storage", desc: "Integrated MinIO storage for images and assets with robust S3-compatible API support for enterprise scaling.", color: "orange" },
              { icon: Palette, title: "Customizable Themes", desc: "Dark mode, light mode, and auto theme switching. Customize the UI to match your organization's brand identity.", color: "pink" },
              { icon: Zap, title: "Lightning Fast", desc: "Built with React 18 and Vite for instant feedback. Engineered for smooth performance even on large, complex boards.", color: "cyan" }
            ].map((feature, index) => (
              <Card
                key={index}
                className={`group relative p-8 border-2 hover:border-${feature.color}-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-${feature.color}-900/10`}
              >
                <CardContent className="p-0">
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 text-${feature.color}-600 dark:text-${feature.color}-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-10">Built with Modern Technologies</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 hover:opacity-100 transition-opacity duration-500">
            {[
              { icon: Code, label: "React 18", color: "#61DAFB" },
              { icon: Layers, label: "TypeScript", color: "#3178C6" },
              { icon: Flash, label: "Vite", color: "#FFCF00" },
              { icon: Palette, label: "Tailwind", color: "#38B2AC" },
              { icon: Database, label: "MinIO", color: "#C72E49" }
            ].map((tech, index) => (
              <div key={index} className="flex flex-col items-center gap-2 group">
                <tech.icon className="w-10 h-10" style={{ color: tech.color }} />
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">{tech.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight mb-6">Ready to take ownership of your ideas?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of developers and teams who prefer self-hosted, secure, and fast whiteboard solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="px-8 py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Start Self-Hosting Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg font-medium"
            >
              Read the Docs
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              M
            </div>
            <span className="font-semibold">Maplify Tech</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
            <a href="https://github.com/rakesh-kadam/maplify-tech" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              GitHub
            </a>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 Maplify Tech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
