import { FaHome, FaShieldAlt, FaUsers, FaLightbulb } from "react-icons/fa";

const teamMembers = [
  { name: "Alif Rahman", role: "CEO & Founder", emoji: "👨‍💼", description: "Passionate about solving Bangladesh's housing problem through technology." },
  { name: "Fatema Khatun", role: "Lead Developer", emoji: "👩‍💻", description: "Full-stack engineer with a focus on user experience and clean code." },
  { name: "Mahmudul Hasan", role: "UI/UX Designer", emoji: "🎨", description: "Crafting beautiful, accessible, and intuitive interfaces." },
  { name: "Nusrat Jahan", role: "Operations Lead", emoji: "📊", description: "Ensuring seamless operations and top-notch user support." },
];

const values = [
  { icon: <FaShieldAlt className="text-purple-400" size={28} />, title: "Trust & Safety", desc: "All listings are manually reviewed to ensure you only see verified, legitimate properties." },
  { icon: <FaUsers className="text-blue-400" size={28} />, title: "Community First", desc: "We connect landlords and tenants in a transparent ecosystem — no hidden fees, no middlemen." },
  { icon: <FaLightbulb className="text-yellow-400" size={28} />, title: "Innovation", desc: "Continuously improving our platform with smart search, real-time filters, and map views." },
  { icon: <FaHome className="text-green-400" size={28} />, title: "For Bangladesh", desc: "Built specifically for Bangladeshi housing needs, supporting all 8 divisions." },
];

export default function About() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-purple-900/50 to-blue-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-900/50 border border-purple-500/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            🇧🇩 Made for Bangladesh
          </div>
          <h1 className="text-5xl font-extrabold mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Basha Lagbe
            </span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Basha Lagbe is Bangladesh&apos;s most trusted rental property platform — connecting thousands of tenants with verified landlords across all 8 divisions. We believe finding a home should be simple, transparent, and stress-free.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              To revolutionize the way people find rental homes in Bangladesh by providing a reliable, transparent, and user-friendly platform. We eliminate the middleman, reduce information asymmetry, and empower both landlords and tenants.
            </p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Our Vision</h2>
            <p className="text-gray-300 leading-relaxed">
              A Bangladesh where every family can find a safe, affordable home in minutes. We envision a future where the rental market is fully digital, data-driven, and accessible to everyone — from Dhaka to Sylhet, from city centers to growing towns.
            </p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 md:col-span-2">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Our Commitment</h2>
            <p className="text-gray-300 leading-relaxed">
              We are committed to maintaining the highest standards of quality, safety, and transparency. Every property on Basha Lagbe is reviewed for authenticity. We take user privacy seriously and never share personal information with third parties. Our support team is always available to resolve disputes and ensure a positive experience for everyone on the platform.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 text-center hover:border-purple-500/50 transition">
                <div className="flex justify-center mb-4">{v.icon}</div>
                <h3 className="font-bold text-white mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Meet the Team</h2>
          <p className="text-gray-400 text-center mb-12">The passionate people building Bangladesh&apos;s future of renting.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-900/20 transition">
                <div className="text-5xl mb-4">{member.emoji}</div>
                <h3 className="text-lg font-bold text-white">{member.name}</h3>
                <p className="text-purple-400 text-sm mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Properties Listed" },
              { value: "2000+", label: "Happy Tenants" },
              { value: "8", label: "Divisions" },
              { value: "2024", label: "Founded" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-extrabold text-white">{stat.value}</div>
                <div className="text-purple-200 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
