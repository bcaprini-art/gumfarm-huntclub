import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-green-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Gumfarm Hunt Club" className="h-12 w-12 rounded-full object-cover border-2 border-tan-300" />
            <div>
              <h1 className="text-white font-serif text-xl font-bold">Gumfarm Hunt Club</h1>
              <p className="text-tan-200 text-xs">Genoa, Illinois</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="text-white hover:text-tan-200 text-sm font-medium">Member Login</Link>
            <Link to="/register" className="bg-tan-300 hover:bg-tan-400 text-green-900 text-sm font-semibold px-4 py-2 rounded">Join Now</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-[70vh] overflow-hidden">
        <img src="/field-winter.jpg" alt="Gumfarm fields" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-green-900/60 flex flex-col items-center justify-center text-center px-4">
          <img src="/logo.jpg" alt="Gumfarm Hunt Club" className="h-24 w-24 rounded-full object-cover border-4 border-tan-300 mb-6 shadow-xl" />
          <h2 className="text-white font-serif text-5xl font-bold mb-4 drop-shadow-lg">Premier Pheasant Hunting</h2>
          <p className="text-tan-200 text-xl mb-8 max-w-2xl">
            A family tradition since 1963 — 7 hunting fields, professional guides, and all birds raised on-site.
            Located 60 miles west of Chicago in Genoa, Illinois.
          </p>
          <div className="flex gap-4">
            <Link to="/register" className="bg-tan-300 hover:bg-tan-400 text-green-900 font-bold px-8 py-3 rounded-lg text-lg shadow-lg">
              Become a Member
            </Link>
            <Link to="/login" className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-3 rounded-lg text-lg border border-white/50">
              Member Login
            </Link>
          </div>
        </div>
      </div>

      {/* Season info banner */}
      <div className="bg-tan-300 py-3 text-center">
        <p className="text-green-900 font-semibold">🦅 Season: October 1 – March 31 &nbsp;·&nbsp; Open Wed–Sun by Reservation &nbsp;·&nbsp; Call/Text Amber: (815) 739-0612</p>
      </div>

      {/* About */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-serif text-3xl text-green-800 font-bold mb-4">A Legacy of Quality Hunting</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Owned and operated by Rich Gum and his daughter Amber, Gumfarm Hunt Club continues a family legacy
              rooted in farming since 1963. All pheasants are raised directly on Gumfarm — ensuring quality and
              consistency in every hunt.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Seven distinct hunting areas encompass native grasses, sorghums, and corn, providing ideal habitat
              for upland game birds. Professional bird hunting dogs and knowledgeable guides enhance every experience.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-800/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-800">7</div>
                <div className="text-sm text-gray-600">Hunting Fields</div>
              </div>
              <div className="bg-green-800/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-800">5</div>
                <div className="text-sm text-gray-600">Expert Guides</div>
              </div>
              <div className="bg-green-800/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-800">60+</div>
                <div className="text-sm text-gray-600">Years of Tradition</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/pheasant-flowers.jpg" alt="Pheasant" className="rounded-lg object-cover h-64 w-full" />
            <img src="/dog-sadie.jpg" alt="Hunting dog" className="rounded-lg object-cover h-64 w-full" />
          </div>
        </div>
      </section>

      {/* Membership tiers */}
      <section className="bg-green-800 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="font-serif text-3xl text-white font-bold text-center mb-12">Membership Options</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Individual', icon: '👤',
                features: ['20 birds in your package', 'Min. 3 birds per hunt', 'Wed–Sun reservations', 'Member bird pricing', 'Bird carry-over not permitted'],
                price: 'Contact for pricing'
              },
              {
                title: 'Family', icon: '👨‍👩‍👧‍👦',
                features: ['Family unit coverage', 'Shared bird package', 'All family members included', 'Member bird pricing', 'Lodge access after hunts'],
                price: 'Contact for pricing', featured: true
              },
              {
                title: 'Corporate', icon: '🏢',
                features: ['Large bird package', 'Multiple named members', 'Guest hunt fees waived', 'Annual due + per-hunt billing', 'Private charter available'],
                price: 'Contact for pricing'
              },
            ].map(tier => (
              <div key={tier.title} className={`rounded-xl p-8 ${tier.featured ? 'bg-tan-300 text-green-900' : 'bg-green-700 text-white'}`}>
                <div className="text-4xl mb-3">{tier.icon}</div>
                <h4 className="font-serif text-2xl font-bold mb-2">{tier.title}</h4>
                <p className={`text-sm font-medium mb-6 ${tier.featured ? 'text-green-800' : 'text-tan-200'}`}>{tier.price}</p>
                <ul className="space-y-2">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center text-tan-200 mt-8 text-sm">
            Guest hunts available — $75/hunter + birds. All hunters must have a valid Illinois hunting license.
          </p>
        </div>
      </section>

      {/* Bird pricing */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h3 className="font-serif text-3xl text-green-800 font-bold text-center mb-10">Bird Pricing</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="bg-green-800 text-white">
                <th className="p-3 text-left">Bird</th>
                <th className="p-3">Member</th>
                <th className="p-3">Non-Member</th>
                <th className="p-3">After Dec 31</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['🦃 Pheasant', '$22', '$29', '+$2 each'],
                ['🐦 Chukar', '$16', '$21', '+$2 each'],
                ['🪶 Quail', '$10', '$12', '+$1 each (min 25)'],
              ].map(([bird, member, nonMember, after]) => (
                <tr key={bird} className="border-b border-gray-200 hover:bg-tan-100">
                  <td className="p-3 text-left font-medium">{bird}</td>
                  <td className="p-3 text-green-700 font-semibold">{member}</td>
                  <td className="p-3">{nonMember}</td>
                  <td className="p-3 text-rust-500 text-sm">{after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-4 text-center text-sm text-gray-600">
          <div className="bg-gray-50 rounded p-4"><strong>Guide Service</strong><br />+$100 (book 1 week ahead)</div>
          <div className="bg-gray-50 rounded p-4"><strong>Bird Cleaning</strong><br />$4–$7 per bird</div>
          <div className="bg-gray-50 rounded p-4"><strong>Credit Cards</strong><br />4% processing fee</div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-tan-100 py-12 px-6 text-center">
        <h3 className="font-serif text-2xl text-green-800 font-bold mb-3">Ready to Hunt?</h3>
        <p className="text-gray-600 mb-6">Reservations by calling or texting Amber. Texting preferred.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="tel:8157390612" className="bg-green-800 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700">
            📞 (815) 739-0612
          </a>
          <span className="text-gray-500">or</span>
          <Link to="/register" className="bg-tan-300 text-green-900 font-semibold px-6 py-3 rounded-lg hover:bg-tan-400">
            Create Member Account
          </Link>
        </div>
        <p className="text-gray-500 text-sm mt-6">33380 Pierce Rd, Genoa, IL 60135 &nbsp;·&nbsp; Open Wed–Sun with confirmed reservation</p>
      </section>

      <footer className="bg-green-900 text-tan-200 py-6 text-center text-sm">
        <p>© {new Date().getFullYear()} Gumfarm Hunt Club · Genoa, Illinois · All Rights Reserved</p>
      </footer>
    </div>
  )
}
