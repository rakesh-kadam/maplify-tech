import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  Pencil, 
  Users, 
  Zap, 
  Shield, 
  Cloud, 
  Palette,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              M
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Maplify Tech
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Your Self-Hosted Collaborative Whiteboard
          </p>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create, collaborate, and visualize ideas with a powerful, privacy-focused 
            whiteboard platform. Built on Excalidraw, designed for teams who value data ownership.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="gap-2" onClick={onGetStarted}>
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/rakesh-kadam/maplify-tech" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Pencil className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Powerful Drawing Tools</CardTitle>
              <CardDescription>
                Create diagrams, flowcharts, wireframes, and sketches with an intuitive interface
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Real-Time Collaboration</CardTitle>
              <CardDescription>
                Work together with your team in real-time with live cursors and instant updates
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Self-Hosted Privacy</CardTitle>
              <CardDescription>
                Your data stays on your infrastructure. Full control over security and compliance
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <Cloud className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Cloud Storage</CardTitle>
              <CardDescription>
                Integrated MinIO storage for images and assets with S3-compatible API
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <CardTitle>Customizable Themes</CardTitle>
              <CardDescription>
                Dark mode, light mode, and auto theme switching for comfortable work anytime
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Built with React 18 and Vite for instant feedback and smooth performance
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Technology Stack */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Built with Modern Technologies</h2>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4 text-lg">Frontend</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>React 18 + TypeScript</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Excalidraw Integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Tailwind CSS + Shadcn UI</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Zustand State Management</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-lg">Backend</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Node.js + Express</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>PostgreSQL + Prisma ORM</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>JWT Authentication</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>MinIO Object Storage</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-base">
                Create your account and start collaborating on your first whiteboard in seconds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" onClick={onGetStarted} className="gap-2">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Maplify Tech. Open source and self-hosted.</p>
        </div>
      </footer>
    </div>
  );
}
