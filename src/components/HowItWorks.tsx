import React from 'react';
import { motion } from 'motion/react';
import { X, Cpu, Target, Zap } from 'lucide-react';

interface HowItWorksProps {
  onClose: () => void;
}

export function HowItWorks({ onClose }: HowItWorksProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 bg-zinc-950 text-white overflow-y-auto p-6 md:p-12 flex flex-col"
    >
      <header className="flex justify-between items-start mb-16 border-b border-zinc-800 pb-8">
        <div>
          <p className="text-xs font-mono tracking-widest text-zinc-500 uppercase mb-2">Documentation</p>
          <h2 className="text-3xl font-bold tracking-tighter">SYSTEM ARCHITECTURE</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-xs font-mono tracking-widest text-red-500 uppercase hover:text-white transition-colors flex items-center gap-2 border border-red-500/30 hover:bg-red-600/10 px-4 py-2"
        >
          ĐÓNG <X className="w-4 h-4" />
        </button>
      </header>

      <div className="w-full max-w-5xl mx-auto space-y-16">
        <div>
          <h1 className="text-[50px] md:text-[80px] font-black leading-[0.9] tracking-tighter mb-4 uppercase">
            CƠ CHẾ <span className="text-red-600 underline decoration-red-600 underline-offset-8">VẬN HÀNH</span>
          </h1>
          <p className="text-xl text-zinc-400 font-medium tracking-tight max-w-2xl">
            Làm thế nào hệ thống đo lường được khả năng bạn bị máy móc tước đoạt công việc? Phân tích dữ liệu diễn ra theo 3 quy trình cốt lõi dưới đây.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="text-4xl font-black italic text-zinc-800">01</span>
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight uppercase mb-4">Quá Trình Phân Tích</h3>
            <p className="text-zinc-400 leading-relaxed font-medium">
              Hệ thống sử dụng mô hình LLM từ Gemini để bóc tách luồng công việc, công nghệ và cấp độ kỹ năng từ CV của bạn. Sau đó, nó 
              <span className="text-white bg-zinc-900 px-1 mx-1">đối chiếu trực tiếp (cross-reference)</span> 
              với tốc độ phát triển hiện tại của Trí tuệ Nhân tạo (AGI, các tự động hóa RPA...).
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="text-4xl font-black italic text-zinc-800">02</span>
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight uppercase mb-4">Chỉ Số Đào Thải (Index)</h3>
            <p className="text-zinc-400 leading-relaxed font-medium">
              <strong className="text-red-500 font-bold">AI Replacement Index</strong> là tỉ lệ % dự báo vai trò cục bộ của bạn bị xóa sổ trong 12 tháng tới. 
              Mỗi kỹ năng được thu thập sẽ có một điểm <strong className="text-white">Điểm Lỗi Thời (0-100)</strong>. Kỹ năng nào chạm mức 80% trở lên bị coi là phế phẩm công nghệ.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="text-4xl font-black italic text-zinc-800">03</span>
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight uppercase mb-4">Lộ Trình Sinh Tồn</h3>
            <p className="text-zinc-400 leading-relaxed font-medium">
              Dựa vào các "điểm mù" rủi ro cao, AI cấu trúc ngược một lộ trình chiến lược. Nó hướng dẫn bạn dịch chuyển từ những 
              <em> tác vụ chân tay lặp đi lặp lại </em> 
              lên vị trí <strong className="text-white border-b border-red-600">tư duy hệ thống và điều phối AI (AI Orchestration)</strong> để duy trì giá trị sống còn.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
          <button 
            onClick={onClose}
            className="bg-white text-black py-4 px-12 font-bold text-sm tracking-widest uppercase hover:bg-zinc-200 transition-colors inline-flex items-center gap-2"
          >
            ĐÃ HIỂU. QUAY LẠI PHÂN TÍCH.
          </button>
        </div>
      </div>
    </motion.div>
  );
}
