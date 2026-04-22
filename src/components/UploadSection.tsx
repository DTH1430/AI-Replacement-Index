import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

// Setup pdf.js worker correctly for Vite
const workerUrl = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

interface UploadSectionProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export function UploadSection({ onAnalyze, isLoading }: UploadSectionProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setError('');
  };

  const extractTextFromPdf = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      setText(fullText);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to read PDF. Please paste your CV text directly.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    if (file.type === 'application/pdf') {
      extractTextFromPdf(file);
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target?.result as string);
        setError('');
      };
      reader.readAsText(file);
    } else {
      setError('Unsupported file format. Please upload PDF or TXT.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      setError('Please provide your CV content first.');
      return;
    }
    onAnalyze(text);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 flex-1 flex flex-col justify-center py-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-[60px] md:text-[80px] font-black leading-[0.9] tracking-tighter mb-4 uppercase">
          TẢI LÊN <span className="text-red-600 underline decoration-red-600 underline-offset-8">DỮ LIỆU</span>
        </h1>
        <p className="text-lg text-zinc-400 font-medium tracking-tight max-w-lg"> Tải lên CV của bạn để phân tích nguy cơ bị thay thế bởi AI trong vòng 12 tháng tới.</p>
      </div>

      <div 
        className={cn(
          "border border-zinc-800 p-8 transition-all duration-300 bg-zinc-900/30",
          isDragging ? "border-red-600 bg-red-600/5" : "hover:border-zinc-700"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="p-4 bg-zinc-950 rounded-full border border-zinc-800 shrink-0">
              <Upload className="w-8 h-8 text-zinc-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">AI Analysis Input</h3>
              <p className="text-zinc-500 mt-1 text-sm">
                Kéo & thả file PDF/TXT vào đây.
              </p>
            </div>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.txt"
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-xs tracking-widest transition-colors whitespace-nowrap"
          >
            CHỌN FILE MÁY TÍNH
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-zinc-950 text-zinc-600 font-mono text-xs uppercase tracking-widest">HOẶC DÁN TEXT TRỰC TIẾP</span>
        </div>
      </div>

      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Dán nội dung CV của bạn vào đây..."
        className="w-full h-48 bg-zinc-900/30 border border-zinc-800 p-6 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-mono resize-y"
      />

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 border border-red-500/20"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading || !text.trim()}
        className={cn(
          "w-full py-5 font-bold text-sm tracking-widest uppercase transition-colors flex items-center justify-center gap-2",
          isLoading 
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
            : "bg-red-600 hover:bg-red-700 text-white"
        )}
      >
        {isLoading ? (
          <span className="animate-pulse">HỆ THỐNG ĐANG PHÂN TÍCH...</span>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            TIẾP TỤC ĐÁNH GIÁ NGUY CƠ
          </>
        )}
      </button>
    </div>
  );
}
