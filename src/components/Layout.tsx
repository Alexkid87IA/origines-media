import React from 'react';
import Sidebar from './Sidebar';
import EngagementSection from './EngagementSection';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showEngagement?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showSidebar = true, 
  showEngagement = true 
}) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] overflow-x-hidden">
      {/* Sidebar Desktop */}
      {showSidebar && <Sidebar />}

      {/* Main Content */}
      <main className={showSidebar ? "md:ml-[280px]" : ""}>
        {children}
      </main>

      {/* Kit d'Inspiration Section - Avec le même décalage que le main */}
      {showEngagement && (
        <div className={showSidebar ? "md:ml-[280px]" : ""}>
          <EngagementSection />
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;