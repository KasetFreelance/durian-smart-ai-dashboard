// app/durian-ai-dashboard/layout.jsx

export const metadata = {
  title: "Durian AI Dashboard",
  description: "แดชบอร์ดแสดงรายงาน AI สำหรับสวนทุเรียน",
};

export default function Layout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
