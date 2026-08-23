import React from 'react';
import { ViewPage } from '../types';
import { ShieldCheck, Award, Users, Flame, HeartPulse, CheckCircle2, Dumbbell, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (page: ViewPage) => void;
  onOpenBooking: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      {/* Page Header */}
      <div className="bg-[#121214] text-white py-16 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* <span className="text-[11px] font-black tracking-widest text-zinc-400 uppercase bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full inline-block mb-3">
            UK DIGITAL COACHING PLATFORM
          </span> */}
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            ABOUT BxStrength
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mt-3">
            What makes our approach different is that you don't have to rely on just one type of professional. Our platform brings together fitness coaching, boxing, strength & conditioning, mobility, and physiotherapy expertise under one system.
          </p>
        </div>
      </div>

      {/* Main Philosophy Section */}
      <section className="py-20 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                THE BxStrength METHODOLOGY
              </span>
              {/* <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight leading-tight">
                BUILT FOR THOSE WHO DEMAND RESULTS WITHOUT GUESSWORK
              </h2> */}

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-normal">
                BxStrength is a personalized fitness coaching platform offering bespoke 1-on-1 virtual performance training and global online coaching.
Our coaching team has experience in boxing, strength training, functional fitness, conditioning, mobility, weight management, and physiotherapy-informed exercise.
Led by a Head Coach with 10+ years of fitness experience, BxStrength has worked with 1,000+ clients, including clients from India, the UK, Canada, Australia, Saudi Arabia, and the UAE.
              </p>
              <p>
                We help beginners and experienced clients become stronger, fitter, more active, and more confident through training tailored to their individual goals.
              </p>

              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight leading-tight">Our Services</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  'Boxing Training',
                  'Strength Training',
                  'Functional Training',
                  'Fat Loss & Weight Management',
                  'Body Toning',
                  'Mobility & Flexibility',
                  'Conditioning',
                  'Beginner Fitness',
                  'Virtual Personal Training',
                  'Personalized Workout Programs',
                  'Movement & Recovery Support',
                  'Yoga Classes and Pilates'
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-zinc-300">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={onOpenBooking}
                  className="bg-white hover:bg-zinc-200 text-black font-black text-xs tracking-widest uppercase px-8 py-4 rounded-lg transition-colors cursor-pointer shadow-lg"
                >
                  BOOK 15-MIN SESSION
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl w-full max-w-md">
                <img
                  src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800"
                  alt="BxStrength Coaching Environment"
                  className="w-full h-[380px] object-cover filter contrast-105"
                />
                <div className="p-4 bg-[#121214] border-t border-zinc-800 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <div>
                    <p className="text-xs font-black uppercase text-white">India Registered Platform</p>
                    <p className="text-[11px] text-zinc-400">New Delhi HQ & Remote Digital Coaching</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
