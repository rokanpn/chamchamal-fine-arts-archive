'use client';

import React, { useState } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  GraduationCap, 
  Mail, 
  MapPin, 
  Sparkles, 
  Award, 
  Building2, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users
} from 'lucide-react';

export function FacultyClient() {
  const { faculty } = useArchive();
  const { locale, isRTL } = useLanguage();
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const sortedFaculty = [...faculty].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-12 sm:gap-16 w-full pb-32 safe-bottom">
      {/* Header Banner */}
      <section className="relative pt-6 sm:pt-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold-light text-xs font-medium tracking-wide mb-4 shadow-gold-glow">
          <Building2 className="w-3.5 h-3.5 text-gold" />
          <span>
            {locale === 'ckb'
              ? 'دەستەی کارگێڕی و مامۆستایانی پەیمانگا'
              : locale === 'ar'
              ? 'مجلس الإدارة والهيئة التدريسية الأكاديمية'
              : 'Administration & Academic Faculty'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-parchment-pure leading-tight font-serif">
          {locale === 'ckb'
            ? 'سەرکردایەتی و مامۆستایانی پەیمانگا'
            : locale === 'ar'
            ? 'قيادة معهد الفنون وأساتذة الأتيلييهات'
            : 'Institute Leadership & Faculty'}
        </h1>

        <p className="mt-4 text-sm sm:text-base text-museum-secondary max-w-2xl leading-relaxed">
          {locale === 'ckb'
            ? 'ڕێبەران، مامۆستایان و کەسایەتییە ئەکادیمیانەی کە بەرپرسیارن لە پەروەردەکردنی نەوەکانی داهاتووی هونەری کوردی لە پەیمانگای هونەرە جوانەکانی چەمچەماڵ.'
            : locale === 'ar'
            ? 'نخبة من كبار الأكاديميين والفنانين الرواد المسؤولين عن صياغة المناهج وتأهيل الأجيال الصاعدة في معهد الفنون الجميلة بجمجمال.'
            : 'The esteemed educators, artists, and department heads cultivating the next vanguard of Kurdish fine art and scholarly preservation.'}
        </p>

        {/* Dean's Welcome Quote Card */}
        {sortedFaculty[0] && (
          <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-obsidian-surface via-[#15151c] to-obsidian-surface border border-gold/40 shadow-gold-glow max-w-3xl w-full text-start flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-gold/50 shadow-art-card">
              <SafeImage
                src={sortedFaculty[0].avatarUrl}
                alt={sortedFaculty[0].name.en}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-2 flex-1 text-center sm:text-start">
              <span className="text-[10px] text-gold uppercase tracking-widest font-mono">
                {locale === 'ckb' ? 'پەیامی ڕاگری پەیمانگا' : 'Dean’s Institutional Inscription'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-parchment-pure font-serif">
                {sortedFaculty[0].name[locale] || sortedFaculty[0].name.ckb}
              </h3>
              <p className="text-xs text-parchment-muted leading-relaxed font-sans italic">
                &ldquo;
                {locale === 'ckb'
                  ? 'ئەرشیفی دیجیتاڵی چەمچەماڵ تەنها مۆزەخانەیەکی ئۆنلاین نییە، بەڵکو بەڵگەنامەی زیندووی خۆڕاگری، ناسنامەی ناوچەی گەرمیان و دەستڕەنگینی نەوە لە دوای نەوەی هونەرمەندانی ئەم خاکەیە.'
                  : 'The Chamchamal Digital Archive is a living testament to resilience, regional memory, and the aesthetic mastery nurtured within our ateliers.'}
                &rdquo;
              </p>
              <span className="text-[11px] text-museum-caption font-mono mt-1">
                {sortedFaculty[0].role[locale] || sortedFaculty[0].role.ckb}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Faculty Directory Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {sortedFaculty.map((member, idx) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="group relative rounded-3xl bg-obsidian-surface/80 border border-museum-border hover:border-gold/50 transition-all duration-300 shadow-art-card flex flex-col overflow-hidden"
          >
            {/* Portrait Cover */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-obsidian-elevated">
              <SafeImage
                src={member.avatarUrl}
                alt={member.name.en}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

              <span className="absolute bottom-3 start-4 px-3 py-1 rounded-full text-[10px] font-semibold bg-black/70 backdrop-blur-md text-gold border border-gold/30">
                {member.department[locale] || member.department.ckb}
              </span>
            </div>

            {/* Info Body */}
            <div className="p-6 flex flex-col flex-1 justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-parchment-pure font-serif group-hover:text-gold-light transition-colors">
                  {member.name[locale] || member.name.ckb}
                </h3>
                <span className="text-xs text-gold font-medium">
                  {member.role[locale] || member.role.ckb}
                </span>

                <p className="text-xs text-museum-secondary leading-relaxed mt-2 line-clamp-3">
                  {member.bio[locale] || member.bio.ckb}
                </p>
              </div>

              {/* Academic Degrees & Contact */}
              <div className="flex flex-col gap-2.5 pt-4 border-t border-museum-divider text-[11px]">
                {member.academicDegrees && member.academicDegrees.length > 0 && (
                  <div className="flex items-start gap-2 text-museum-caption">
                    <GraduationCap className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="truncate">
                      {member.academicDegrees[0][locale] || member.academicDegrees[0].ckb}
                    </span>
                  </div>
                )}

                {member.officeLocation && (
                  <div className="flex items-center gap-2 text-museum-caption">
                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span className="truncate">
                      {member.officeLocation[locale] || member.officeLocation.ckb}
                    </span>
                  </div>
                )}

                {member.contactEmail && (
                  <div className="flex items-center gap-2 text-gold-light font-mono text-[10px]">
                    <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                    <a href={`mailto:${member.contactEmail}`} className="hover:underline truncate">
                      {member.contactEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
