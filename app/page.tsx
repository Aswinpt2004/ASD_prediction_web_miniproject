import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Users, FileText, MessageSquare, Upload, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PA</span>
            </div>
            <span className="font-bold text-lg text-slate-900">PREDICT-ASD</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 text-balance">
          Early ASD Screening Made Simple
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto text-balance">
          A secure, comprehensive platform connecting parents, doctors, and specialists for early autism spectrum
          disorder assessment and care coordination.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register?role=caretaker">
            <Button size="lg" className="w-full sm:w-auto">
              I'm a Parent/Caretaker
            </Button>
          </Link>
          <Link href="/register?role=doctor">
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              I'm a Healthcare Provider
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Comprehensive Assessment Tools</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Standardized Questionnaires",
                description: "M-CHAT, SCQ, and TABC screening tools with automated scoring and risk assessment.",
              },
              {
                icon: Upload,
                title: "Secure Media Upload",
                description: "Share videos and audio samples with healthcare providers for detailed evaluation.",
              },
              {
                icon: MessageSquare,
                title: "Real-time Communication",
                description: "Direct messaging between parents and doctors for quick consultations and updates.",
              },
              {
                icon: BarChart3,
                title: "Detailed Reports",
                description: "Professional diagnostic reports and recommendations from qualified specialists.",
              },
              {
                icon: Users,
                title: "Multi-role Access",
                description: "Secure role-based dashboards for parents, doctors, and administrators.",
              },
              {
                icon: CheckCircle2,
                title: "HIPAA Compliant",
                description: "Enterprise-grade security and privacy protection for sensitive health data.",
              },
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Register", desc: "Create your account as a parent or healthcare provider" },
              { step: "2", title: "Add Child", desc: "Enter your child's information and medical history" },
              { step: "3", title: "Complete Assessment", desc: "Fill out standardized screening questionnaires" },
              { step: "4", title: "Get Results", desc: "Receive professional evaluation and recommendations" },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Child's Assessment Today</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of families getting early support and professional guidance.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">PREDICT-ASD</h4>
              <p className="text-sm">Early autism screening for better outcomes.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    HIPAA
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm">
            <p>&copy; 2025 PREDICT-ASD. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
