"use client";

import React from "react";


const Navigation = ({ activeTab, onTabChange }) => {
  const navItems = [
    { title: "ผังห้อง", href: "/site" },
    { title: "มิเตอร์", href: "/site" },
    { title: "ทำบิล", href: "/site" },
    { title: "สัญญาเช่า", href: "/site" },
    { title: "พัสดุ", href: "/site" },
    { title: "วิเคราะห์ข้อมูล", href: "/site" },
    { title: "รายงานสรุป", href: "/site" },
    { title: "สื่อสารกับผู้เช่า", href: "/site" },
  ];

  const navStyle = {
    backgroundColor: 'white',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    marginTop: '112px', // 28rem converted to pixels
  };

  const containerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 0',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  };

  const subtitleStyle = {
    color: '#4B5563',
    marginBottom: '1.5rem',
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
    paddingBottom: '1rem',
  };

  const buttonBaseStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    cursor: 'pointer',
    border: 'none',
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <div style={contentStyle}>
          <h1 style={titleStyle}>
            ฟังก์ชั่นฝั่งผู้ประกอบการ (เจ้าของหอพัก)
          </h1>
          <p style={subtitleStyle}>
            LinkCo ดูแลครบ จบทุกเรื่องหอพัก เพื่อชีวิตที่ง่ายกว่า
          </p>
          <div style={buttonContainerStyle}>
            {navItems.map((item, index) => {
              const isActive = activeTab === item.title;
              const buttonStyle = {
                ...buttonBaseStyle,
                backgroundColor: isActive ? '#67AAC3' : '#DAF8FD',
                color: isActive ? 'white' : '#374151',
              };
              
              return (
                <button
                  key={index}
                  onClick={() => onTabChange(item.title)}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#C5E4F9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#DAF8FD';
                    }
                  }}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;