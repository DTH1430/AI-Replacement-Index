import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { CVAnalysisResult } from '../lib/gemini';
import { ShieldAlert, Target, ShieldCheck, ArrowRight, Zap, Share2, Facebook, Twitter, Linkedin, Download, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { toPng, toBlob } from 'html-to-image';

interface ResultSectionProps {
  result: CVAnalysisResult;
  onReset: () => void;
}

export function ResultSection({ result, onReset }: ResultSectionProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [expandedSkillIndex, setExpandedSkillIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const filterElements = (node: HTMLElement) => {
    return node.id !== 'action-buttons-container';
  };

  const captureImage = async (): Promise<string | null> => {
    if (!captureRef.current) return null;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(captureRef.current, {
        backgroundColor: '#09090b',
        pixelRatio: 2,
        filter: filterElements,
      });
      return dataUrl;
    } catch (error) {
      console.error("Failed to capture image", error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const captureBlob = async (): Promise<Blob | null> => {
    if (!captureRef.current) return null;
    setIsGenerating(true);
    try {
      const blob = await toBlob(captureRef.current, {
        backgroundColor: '#09090b',
        pixelRatio: 2,
        filter: filterElements,
      });
      return blob;
    } catch (error) {
      console.error("Failed to capture image as blob", error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    const dataUrl = await captureImage();
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `AI-Replacement-${result.probability}percent.png`;
      link.href = dataUrl;
      link.click();
    } else {
      alert("Lỗi khi tạo ảnh. Vui lòng thử lại.");
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://baogioaimatviec.io';
    const shareText = `Hệ thống vừa phán quyết tôi có ${result.probability}% nguy cơ bị AI đào thải.\n\nAI phán: "${result.verdict}"\n\nTự tin thì vào thử xem bao giờ bạn ra rìa: ${url}`;
    
    if (navigator.share) {
      try {
        const blob = await captureBlob();
        if (blob) {
          const file = new File([blob], 'ai-result.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Bao Giờ AI Cướp Việc Bạn?',
              text: shareText,
              files: [file]
            });
            return;
          }
        }
        await navigator.share({ title: 'Bao Giờ AI Cướp Việc Bạn?', text: shareText });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
           fallbackCopy(shareText);
        }
      }
    } else {
      fallbackCopy(shareText);
    }
  };

  const fallbackCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://baogioaimatviec.io';
  const shareText = `Hệ thống vừa phán quyết tôi có ${result.probability}% nguy cơ bị AI đào thải.\n\nAI phán: "${result.verdict}"\n\nTự tin thì vào thử xem bao giờ bạn ra rìa: ${shareUrl}`;

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToFacebook = () => {
    alert("Vui lòng 'Tải Ảnh Kết Quả' để đính kèm khi share lên Facebook nhằm hiển thị bảng điểm của bạn!");
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToLinkedin = () => {
    alert("Vui lòng 'Tải Ảnh Kết Quả' để đính kèm bài post LinkedIn nhằm khoe bảng điểm của bạn!");
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  // Determine color based on probability
  const getColor = (prob: number) => {
    if (prob > 75) return 'text-red-500';
    if (prob > 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getBgColor = (prob: number) => {
    if (prob > 75) return 'bg-red-500';
    if (prob > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const chartData = result.skillsAnalysis.map((s) => ({
    subject: s.name,
    A: s.obsolescenceScore,
    fullMark: 100,
  }));

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Obsolete': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'At Risk': return <Target className="w-5 h-5 text-yellow-500" />;
      default: return <ShieldCheck className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex-1"
    >
      <div 
        ref={captureRef}
        className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4 md:pt-8 bg-zinc-950 px-2 sm:px-6 md:px-8 pb-8 -mx-2 sm:-mx-6 md:-mx-8 rounded-2xl"
      >
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="mb-4">
            <span className="text-[14px] bg-red-600 text-white px-2 py-1 font-bold uppercase tracking-wider">The Verdict</span>
          </div>
          <h1 className="text-[100px] md:text-[140px] font-black leading-[0.85] tracking-tighter mb-8">
            {result.probability}<span className="text-red-600">%</span>
          </h1>
          <p className="text-2xl md:text-3xl font-medium tracking-tight leading-tight text-zinc-300 max-w-md">
            {result.verdict}
          </p>

          <div className="mt-12 space-y-6">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Mức độ đe dọa từng kỹ năng</p>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* The Radar chart reused here */}
              <div className="h-[250px] w-full bg-zinc-900/30 p-4 border border-zinc-800/50">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#333" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} />
                    <Radar name="Mức độ lỗi thời" dataKey="A" stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2" data-html2canvas-ignore>
                {/* 
                   Wait, actually we shouldn't ignore the skills list. 
                   html2canvas doesn't always render overflow well.
                   Let's remove overflow for the capture if needed, 
                   or just leave it. 
                */}
                {result.skillsAnalysis.map((skill, idx) => {
                  const isExpanded = expandedSkillIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className="space-y-1 cursor-pointer group"
                      onClick={() => setExpandedSkillIndex(isExpanded ? null : idx)}
                    >
                      <div className="flex justify-between text-xs font-mono p-1 group-hover:bg-zinc-800/50 transition-colors">
                        <span className="flex items-center gap-2">
                           {getStatusIcon(skill.status)}
                           <span className="truncate max-w-[120px] underline decoration-zinc-700 underline-offset-4">{skill.name}</span>
                        </span>
                        <span className={cn("font-bold", skill.obsolescenceScore > 75 ? "text-red-500" : skill.obsolescenceScore > 40 ? "text-yellow-500" : "text-green-500")}>
                          {skill.obsolescenceScore}%
                        </span>
                      </div>
                      <div className="h-1 bg-zinc-800 w-full">
                        <div 
                          className={cn("h-full transition-all duration-500", skill.obsolescenceScore > 75 ? "bg-red-600" : skill.obsolescenceScore > 40 ? "bg-yellow-500" : "bg-green-500")} 
                          style={{ width: `${skill.obsolescenceScore}%` }}
                        ></div>
                      </div>
                      
                      {/* Expandable Reasoning */}
                      <motion.div 
                        initial={false}
                        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 bg-zinc-900 border-l-2 border-red-600 mt-2 text-sm text-zinc-300 font-medium">
                          {skill.reasoning || "Không có dữ liệu giải thích từ hệ thống."}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 bg-white text-black p-4 sm:p-8 rounded-tr-[50px] sm:rounded-tr-[100px] flex flex-col items-stretch h-full">
          <h3 className="text-xs font-mono uppercase tracking-widest mb-6 opacity-60">Survival Roadmap</h3>
          <h4 className="text-3xl sm:text-4xl font-black tracking-tighter mb-8 leading-none italic uppercase">Tiến hóa hay Bị đào thải.</h4>
          
          <div className="space-y-8 flex-1">
            {result.roadmap.map((step, idx) => (
              <div key={idx} className="border-l-4 border-black pl-4">
                <p className="text-xs font-bold uppercase mb-1">Pha 0{step.step}: {step.title}</p>
                <p className="text-lg font-medium leading-tight">{step.description}</p>
              </div>
            ))}
          </div>

          <div id="action-buttons-container" className="mt-12 pt-8 border-t border-black/10 flex flex-col gap-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1 text-center">Phát tán lên mạng</p>
            
            <button
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="w-full bg-red-600 text-white py-4 font-bold text-sm tracking-widest uppercase hover:bg-red-700 transition-colors flex justify-center items-center gap-2"
            >
              <Download className="w-5 h-5" />
              {isGenerating ? "ĐANG TẠO ẢNH..." : "TẢI ẢNH KẾT QUẢ"}
            </button>

            <div className="grid grid-cols-2 gap-2 mt-2">
               <button
                onClick={handleShare}
                className="w-full bg-black text-white py-3 font-bold text-[10px] sm:text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors flex justify-center items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                {isCopied ? "ĐÃ COPY!" : "SHARE LINK"}
              </button>
              
              <button
                onClick={shareToTwitter}
                className="bg-[#000000] border border-zinc-800 text-white flex justify-center items-center py-3 hover:bg-zinc-900 transition-colors"
                aria-label="Share to Twitter"
              >
                <Twitter className="w-4 h-4 fill-current mr-2" /> X / TWITTER
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-white">
              <button
                onClick={shareToFacebook}
                className="bg-[#1877F2] font-bold text-[10px] sm:text-xs tracking-widest flex justify-center items-center py-3 hover:opacity-90 transition-opacity"
                aria-label="Share to Facebook"
              >
                <Facebook className="w-4 h-4 fill-current mr-2" /> FACEBOOK
              </button>

              <button
                onClick={shareToLinkedin}
                className="bg-[#0A66C2] font-bold text-[10px] sm:text-xs tracking-widest flex justify-center items-center py-3 hover:opacity-90 transition-opacity"
                aria-label="Share to LinkedIn"
              >
                <Linkedin className="w-4 h-4 fill-current mr-2" /> LINKEDIN
              </button>
            </div>

            <button
              onClick={onReset}
              className="w-full bg-white border-2 border-black text-black py-4 mt-4 font-bold text-sm tracking-widest uppercase hover:bg-zinc-100 transition-colors flex justify-center items-center gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              THỬ CV KHÁC
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="lg:col-span-12 border-t border-zinc-800 pt-6 mt-4">
          <p className="text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest text-center max-w-4xl mx-auto leading-relaxed">
            <strong className="text-zinc-300">Disclaimer:</strong> The AI Replacement Index and Survival Roadmap are for informational and entertainment purposes only. Do not consider this as professional career advice. 
            <br className="hidden sm:block" />
            <strong className="text-zinc-300 ml-0 sm:ml-2">Cảnh báo:</strong> Đánh giá này chỉ mang mục đích giải trí và tham khảo vui. Không phải lời khuyên nghề nghiệp.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
