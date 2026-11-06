'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { useArchive, AmbientTrack } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { useResolvedAudioUrl } from '@/hooks/useResolvedAudioUrl';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { QRBatchStudio } from '@/components/admin/QRBatchStudio';
import { FileUploadDropzone } from '@/components/admin/FileUploadDropzone';
import { DepartmentConfigEditor } from '@/components/admin/DepartmentConfigEditor';
import { 
  PlusCircle, 
  Box, 
  Palette, 
  GraduationCap, 
  Wrench, 
  Search, 
  Trash2, 
  Eye, 
  QrCode, 
  Layers, 
  Sparkles, 
  SlidersHorizontal, 
  ArrowUpRight, 
  Printer, 
  ExternalLink, 
  Pencil,
  Building2,
  Globe,
  Award,
  Mail,
  MapPin,
  Music,
  Play,
  Volume2
} from 'lucide-react';

function AdminTrackAudioPreview({ url }: { url: string }) {
  const { resolvedUrl, isLoading, isIdb, error } = useResolvedAudioUrl(url);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-museum-secondary">
        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
        <span>Resolving...</span>
      </div>
    );
  }

  if (error || !resolvedUrl) {
    return (
      <span className="text-[10px] text-red-400 font-mono">
        Failed to resolve audio
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isIdb && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-gold/15 text-gold border border-gold/30">
          IndexedDB
        </span>
      )}
      <audio
        controls
        src={resolvedUrl}
        preload="metadata"
        className="h-8 max-w-[220px] rounded-lg"
      />
    </div>
  );
}

export default function AdminDashboardPage() {
  const { 
    artworks, 
    students, 
    tools, 
    faculty, 
    collaborators, 
    gallerySettings,
    updateGallerySettings,
    deleteArtwork, 
    toggle3DStatus, 
    deleteTool,
    deleteStudent,
    deleteFaculty,
    deleteCollaborator
  } = useArchive();
  const { locale, isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState<'artworks' | 'tools' | 'students' | 'faculty' | 'collaborators' | 'plaques' | 'departments' | 'settings'>('artworks');

  // New Ambient Track Form State
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackUrl, setNewTrackUrl] = useState('');
  const [newTrackFileName, setNewTrackFileName] = useState('');

  // Search queries for each tab
  const [artSearchQuery, setArtSearchQuery] = useState('');
  const [selectedArtDept, setSelectedArtDept] = useState<string>('all');

  const [toolSearchQuery, setToolSearchQuery] = useState('');
  const [selectedToolCat, setSelectedToolCat] = useState<string>('all');

  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [facultySearchQuery, setFacultySearchQuery] = useState('');
  const [collaboratorSearchQuery, setCollaboratorSearchQuery] = useState('');

  // Filtered artworks
  const filteredArtworks = useMemo(() => {
    return artworks.filter((art) => {
      const matchSearch =
        art.title.ckb.toLowerCase().includes(artSearchQuery.toLowerCase()) ||
        art.title.en.toLowerCase().includes(artSearchQuery.toLowerCase()) ||
        art.artist.ckb.toLowerCase().includes(artSearchQuery.toLowerCase());

      const matchDept = selectedArtDept === 'all' || art.category === selectedArtDept;

      return matchSearch && matchDept;
    });
  }, [artworks, artSearchQuery, selectedArtDept]);

  // Filtered atelier tools
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchSearch =
        tool.name.ckb.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
        tool.name.en.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
        tool.name.ar.toLowerCase().includes(toolSearchQuery.toLowerCase());

      const matchCat = selectedToolCat === 'all' || tool.category === selectedToolCat;

      return matchSearch && matchCat;
    });
  }, [tools, toolSearchQuery, selectedToolCat]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const term = studentSearchQuery.toLowerCase();
      return (
        s.fullName.ckb.toLowerCase().includes(term) ||
        s.fullName.en.toLowerCase().includes(term) ||
        s.department.ckb.toLowerCase().includes(term)
      );
    });
  }, [students, studentSearchQuery]);

  // Filtered faculty
  const filteredFaculty = useMemo(() => {
    return faculty.filter((f) => {
      const term = facultySearchQuery.toLowerCase();
      return (
        f.name.ckb.toLowerCase().includes(term) ||
        f.name.en.toLowerCase().includes(term) ||
        f.role.ckb.toLowerCase().includes(term)
      );
    });
  }, [faculty, facultySearchQuery]);

  // Filtered collaborators
  const filteredCollaborators = useMemo(() => {
    return collaborators.filter((c) => {
      const term = collaboratorSearchQuery.toLowerCase();
      return (
        c.name.ckb.toLowerCase().includes(term) ||
        c.name.en.toLowerCase().includes(term) ||
        c.country.ckb.toLowerCase().includes(term)
      );
    });
  }, [collaborators, collaboratorSearchQuery]);

  // Metrics
  const totalWorks = artworks.length;
  const count3D = artworks.filter((a) => a.has3DModel).length;
  const countStudents = students.length;
  const countTools = tools.length;
  const countFaculty = faculty.length;
  const countCollaborators = collaborators.length;

  return (
    <AdminAuthGuard>
      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
        {/* Metric Cards Banner (6 Cards) */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 print:hidden">
          {/* Card 1: Total Masterworks */}
          <div className="p-4 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-museum-secondary font-serif">
                {locale === 'ckb' ? 'شاکارەکان' : 'Artworks'}
              </span>
              <Palette className="w-3.5 h-3.5 text-gold" />
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-parchment-pure font-serif">
                {totalWorks}
              </span>
              <span className="text-[9px] text-emerald-400 block mt-0.5 font-mono">
                Cataloged
              </span>
            </div>
          </div>

          {/* Card 2: 3D & AR Models */}
          <div className="p-4 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-museum-secondary font-serif">
                {locale === 'ckb' ? 'سکانی ۳D' : '3D / AR'}
              </span>
              <Box className="w-3.5 h-3.5 text-gold" />
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-gold font-serif">
                {count3D}
              </span>
              <span className="text-[9px] text-gold-light block mt-0.5 font-mono">
                Meshes
              </span>
            </div>
          </div>

          {/* Card 3: Enrolled Artists */}
          <div className="p-4 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-museum-secondary font-serif">
                {locale === 'ckb' ? 'خوێندکاران' : 'Students'}
              </span>
              <GraduationCap className="w-3.5 h-3.5 text-gold" />
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-parchment-pure font-serif">
                {countStudents}
              </span>
              <span className="text-[9px] text-museum-caption block mt-0.5 font-mono">
                Alumni
              </span>
            </div>
          </div>

          {/* Card 4: Atelier Tools */}
          <div className="p-4 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-museum-secondary font-serif">
                {locale === 'ckb' ? 'کەرەستەکان' : 'Atelier Tools'}
              </span>
              <Wrench className="w-3.5 h-3.5 text-gold" />
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-parchment-pure font-serif">
                {countTools}
              </span>
              <span className="text-[9px] text-museum-caption block mt-0.5 font-mono">
                Instruments
              </span>
            </div>
          </div>

          {/* Card 5: Faculty & Leaders */}
          <div className="p-4 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-museum-secondary font-serif">
                {locale === 'ckb' ? 'مامۆستایان' : 'Faculty'}
              </span>
              <Building2 className="w-3.5 h-3.5 text-gold" />
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-parchment-pure font-serif">
                {countFaculty}
              </span>
              <span className="text-[9px] text-museum-caption block mt-0.5 font-mono">
                Leadership
              </span>
            </div>
          </div>

          {/* Card 6: Collaborators */}
          <div className="p-4 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-museum-secondary font-serif">
                {locale === 'ckb' ? 'میوانەکان' : 'Collaborators'}
              </span>
              <Globe className="w-3.5 h-3.5 text-gold" />
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-parchment-pure font-serif">
                {countCollaborators}
              </span>
              <span className="text-[9px] text-museum-caption block mt-0.5 font-mono">
                Residencies
              </span>
            </div>
          </div>
        </section>

        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-museum-divider pb-3 print:hidden">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none no-scrollbar">
            <button
              onClick={() => setActiveTab('artworks')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'artworks'
                  ? 'bg-gold text-obsidian shadow-gold-glow'
                  : 'text-museum-secondary hover:text-parchment'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{locale === 'ckb' ? 'شاکارەکان' : 'Artworks'}</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'tools'
                  ? 'bg-gold text-obsidian shadow-gold-glow'
                  : 'text-museum-secondary hover:text-parchment'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{locale === 'ckb' ? 'کەرەستەکان' : 'Tools'}</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'students'
                  ? 'bg-gold text-obsidian shadow-gold-glow'
                  : 'text-museum-secondary hover:text-parchment'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{locale === 'ckb' ? 'خوێندکاران' : 'Students'}</span>
            </button>

            <button
              onClick={() => setActiveTab('faculty')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'faculty'
                  ? 'bg-gold text-obsidian shadow-gold-glow'
                  : 'text-museum-secondary hover:text-parchment'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{locale === 'ckb' ? 'دەستەی کارگێڕی' : 'Faculty'}</span>
            </button>

            <button
              onClick={() => setActiveTab('collaborators')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'collaborators'
                  ? 'bg-gold text-obsidian shadow-gold-glow'
                  : 'text-museum-secondary hover:text-parchment'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale === 'ckb' ? 'هاوبەشەکان' : 'Collaborators'}</span>
            </button>

            <button
              onClick={() => setActiveTab('plaques')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'plaques'
                  ? 'bg-gold text-obsidian shadow-gold-glow'
                  : 'text-museum-secondary hover:text-parchment'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{locale === 'ckb' ? 'پلاتی QR' : 'QR Plaques'}</span>
            </button>

            <button
              onClick={() => setActiveTab('departments')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'departments'
                  ? 'bg-gold text-obsidian shadow-gold-glow'
                  : 'text-museum-secondary hover:text-parchment'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{locale === 'ckb' ? 'بەشە فەرمییەکان' : locale === 'ar' ? 'الأقسام الرسمية' : 'Departments'}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-gold text-obsidian shadow-gold-glow'
                  : 'text-museum-secondary hover:text-parchment'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{locale === 'ckb' ? 'ڕێکخستنەکانی پێشانگا' : locale === 'ar' ? 'إعدادات المعرض' : 'Gallery Settings'}</span>
            </button>
          </div>

          {/* Action Button based on Active Tab */}
          <div className="flex items-center gap-2">
            {activeTab === 'artworks' && (
              <Link
                href="/admin/artworks/new"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow flex items-center gap-1.5 whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'زیادکردنی بەرهەم' : 'Add Artwork'}</span>
              </Link>
            )}

            {activeTab === 'tools' && (
              <Link
                href="/admin/tools/new"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow flex items-center gap-1.5 whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'زیادکردنی کەرەستە' : 'Add Tool'}</span>
              </Link>
            )}

            {activeTab === 'students' && (
              <Link
                href="/admin/students/new"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow flex items-center gap-1.5 whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'زیادکردنی خوێندکار' : 'Add Student'}</span>
              </Link>
            )}

            {activeTab === 'faculty' && (
              <Link
                href="/admin/faculty/new"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow flex items-center gap-1.5 whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'زیادکردنی مامۆستا' : 'Add Faculty'}</span>
              </Link>
            )}

            {activeTab === 'collaborators' && (
              <Link
                href="/admin/collaborators/new"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow flex items-center gap-1.5 whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'تۆمارکردنی هاوبەش' : 'Archive Collaborator'}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Tab 1: Artworks Registry */}
        {activeTab === 'artworks' && (
          <div className="flex flex-col gap-5 print:hidden">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-obsidian-surface/60 border border-museum-border">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={artSearchQuery}
                  onChange={(e) => setArtSearchQuery(e.target.value)}
                  placeholder={locale === 'ckb' ? 'گەڕان بەپێی ناوی بەرهەم یان هونەرمەند...' : 'Search masterworks or artists...'}
                  className="w-full ps-9 pe-4 py-2 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                />
                <Search className="w-4 h-4 text-museum-secondary absolute top-1/2 -translate-y-1/2 start-3" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['all', 'painting', 'sculpture', 'ceramics', 'design'].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedArtDept(dept)}
                    className={`px-3 py-1.5 rounded-full text-[11px] whitespace-nowrap transition-colors ${
                      selectedArtDept === dept
                        ? 'bg-gold/20 text-gold-light border border-gold/40'
                        : 'bg-white/5 text-museum-secondary hover:text-parchment'
                    }`}
                  >
                    {dept === 'all'
                      ? 'All'
                      : dept.charAt(0).toUpperCase() + dept.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="rounded-3xl bg-obsidian-surface/80 border border-museum-border overflow-hidden shadow-art-card">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="border-b border-museum-divider bg-black/40 text-museum-secondary font-mono uppercase text-[10px]">
                      <th className="py-3 px-4 text-start">Artwork</th>
                      <th className="py-3 px-4 text-start">Department</th>
                      <th className="py-3 px-4 text-start">Year</th>
                      <th className="py-3 px-4 text-start">Pedestal Provenance</th>
                      <th className="py-3 px-4 text-center">3D Status</th>
                      <th className="py-3 px-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-museum-divider">
                    {filteredArtworks.map((art) => (
                      <tr key={art.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-obsidian-elevated shrink-0">
                              <SafeImage
                                src={art.imageUrl}
                                alt={art.title.en}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-parchment-pure truncate max-w-[200px]">
                                {art.title[locale] || art.title.ckb}
                              </span>
                              <span className="text-[11px] text-museum-secondary truncate">
                                {art.artist[locale] || art.artist.ckb}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-museum-secondary">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/5">
                            {art.categoryLabel[locale] || art.categoryLabel.ckb}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-gold/80">
                          {art.year}
                        </td>

                        <td className="py-3 px-4 font-mono text-museum-secondary">
                          {art.provenancePedestal}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggle3DStatus(art.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 transition-all ${
                              art.has3DModel
                                ? 'bg-gold/20 text-gold border border-gold/40'
                                : 'bg-white/5 text-museum-caption hover:text-parchment'
                            }`}
                          >
                            <Box className="w-3 h-3" />
                            <span>{art.has3DModel ? 'Active' : 'Disabled'}</span>
                          </button>
                        </td>

                        <td className="py-3 px-4 text-end">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              href={`/admin/artworks/${art.slug}/edit`}
                              className="p-1.5 rounded-lg hover:bg-gold/15 text-museum-secondary hover:text-gold hover:shadow-gold-glow transition-all"
                              title="Edit Artwork"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>

                            <Link
                              href={`/artworks/${art.slug}`}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-museum-secondary hover:text-gold transition-colors"
                              title="Inspect Live Route"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to de-catalog this artwork?')) {
                                  deleteArtwork(art.id);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-400/10 text-museum-secondary hover:text-red-400 transition-colors"
                              title="Delete from Archive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tools Registry */}
        {activeTab === 'tools' && (
          <div className="flex flex-col gap-5 print:hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-obsidian-surface/60 border border-museum-border">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={toolSearchQuery}
                  onChange={(e) => setToolSearchQuery(e.target.value)}
                  placeholder={locale === 'ckb' ? 'گەڕان لە کەرەستەکان...' : 'Search atelier instruments...'}
                  className="w-full ps-9 pe-4 py-2 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                />
                <Search className="w-4 h-4 text-museum-secondary absolute top-1/2 -translate-y-1/2 start-3" />
              </div>
            </div>

            <div className="rounded-3xl bg-obsidian-surface/80 border border-museum-border overflow-hidden shadow-art-card">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="border-b border-museum-divider bg-black/40 text-museum-secondary font-mono uppercase text-[10px]">
                      <th className="py-3 px-4 text-start">Instrument</th>
                      <th className="py-3 px-4 text-start">Category</th>
                      <th className="py-3 px-4 text-start">Provenance & Materials</th>
                      <th className="py-3 px-4 text-center">Linked Works</th>
                      <th className="py-3 px-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-museum-divider">
                    {filteredTools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-obsidian-elevated shrink-0 border border-museum-border">
                              <SafeImage src={tool.imageUrl} alt={tool.name.en} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-parchment-pure truncate max-w-[220px]">
                                {tool.name[locale] || tool.name.ckb}
                              </span>
                              <span className="text-[11px] text-museum-secondary truncate">
                                {tool.name.en}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-museum-secondary">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-gold/10 text-gold border border-gold/20">
                            {tool.categoryLabel[locale] || tool.categoryLabel.ckb}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-museum-secondary max-w-[200px] truncate">
                          <span className="block truncate text-parchment">{tool.origin[locale] || tool.origin.ckb}</span>
                          <span className="text-[10px] text-museum-caption truncate block">{tool.materials[locale] || tool.materials.ckb}</span>
                        </td>

                        <td className="py-3 px-4 text-center font-mono text-gold">
                          {tool.usedInArtworkSlugs.length} works
                        </td>

                        <td className="py-3 px-4 text-end">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              href={`/admin/tools/${tool.slug}/edit`}
                              className="p-1.5 rounded-lg hover:bg-gold/15 text-museum-secondary hover:text-gold hover:shadow-gold-glow transition-all"
                              title={locale === 'ckb' ? 'دەستکاریکردنی کەرەستە' : locale === 'ar' ? 'تعديل الأداة' : 'Edit Tool'}
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>

                            <Link
                              href={`/tools/${tool.slug}`}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-museum-secondary hover:text-gold transition-colors"
                              title="Inspect Live Route"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to de-catalog "${tool.name.en}"?`)) {
                                  deleteTool(tool.id);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-400/10 text-museum-secondary hover:text-red-400 transition-colors"
                              title="Delete from Tools Archive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Students & Alumni Registry */}
        {activeTab === 'students' && (
          <div className="flex flex-col gap-5 print:hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-obsidian-surface/60 border border-museum-border">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  placeholder={locale === 'ckb' ? 'گەڕان بەپێی ناوی خوێندکار یان بەش...' : 'Search student artists or department...'}
                  className="w-full ps-9 pe-4 py-2 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                />
                <Search className="w-4 h-4 text-museum-secondary absolute top-1/2 -translate-y-1/2 start-3" />
              </div>
            </div>

            <div className="rounded-3xl bg-obsidian-surface/80 border border-museum-border overflow-hidden shadow-art-card">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="border-b border-museum-divider bg-black/40 text-museum-secondary font-mono uppercase text-[10px]">
                      <th className="py-3 px-4 text-start">Student Artist</th>
                      <th className="py-3 px-4 text-start">Department</th>
                      <th className="py-3 px-4 text-start">Cohort Year</th>
                      <th className="py-3 px-4 text-center">Linked Works</th>
                      <th className="py-3 px-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-museum-divider">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-obsidian-elevated shrink-0 border border-gold/40">
                              <SafeImage src={student.avatarUrl} alt={student.fullName.en} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-parchment-pure truncate max-w-[200px]">
                                {student.fullName[locale] || student.fullName.ckb}
                              </span>
                              <span className="text-[11px] text-museum-secondary truncate">
                                {student.fullName.en}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-museum-secondary">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/5">
                            {student.department[locale] || student.department.ckb}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-gold">
                          Class of {student.graduationYear}
                        </td>

                        <td className="py-3 px-4 text-center font-mono text-parchment">
                          {student.artworkSlugs?.length || 0} works
                        </td>

                        <td className="py-3 px-4 text-end">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              href={`/admin/students/${student.id}/edit`}
                              className="p-1.5 rounded-lg hover:bg-gold/15 text-museum-secondary hover:text-gold hover:shadow-gold-glow transition-all"
                              title={locale === 'ckb' ? 'دەستکاریکردنی خوێندکار' : locale === 'ar' ? 'تعديل بيانات الطالب' : 'Edit Student'}
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>

                            <Link
                              href={`/students/${student.id}`}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-museum-secondary hover:text-gold transition-colors"
                              title="Inspect Student Portfolio"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => {
                                if (confirm(`Remove profile of "${student.fullName.en}"?`)) {
                                  deleteStudent(student.id);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-400/10 text-museum-secondary hover:text-red-400 transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Faculty & Board Registry */}
        {activeTab === 'faculty' && (
          <div className="flex flex-col gap-5 print:hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-obsidian-surface/60 border border-museum-border">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={facultySearchQuery}
                  onChange={(e) => setFacultySearchQuery(e.target.value)}
                  placeholder={locale === 'ckb' ? 'گەڕان لە مامۆستایاندا...' : 'Search faculty members...'}
                  className="w-full ps-9 pe-4 py-2 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                />
                <Search className="w-4 h-4 text-museum-secondary absolute top-1/2 -translate-y-1/2 start-3" />
              </div>
            </div>

            <div className="rounded-3xl bg-obsidian-surface/80 border border-museum-border overflow-hidden shadow-art-card">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="border-b border-museum-divider bg-black/40 text-museum-secondary font-mono uppercase text-[10px]">
                      <th className="py-3 px-4 text-start">Faculty Member</th>
                      <th className="py-3 px-4 text-start">Leadership Post</th>
                      <th className="py-3 px-4 text-start">Department</th>
                      <th className="py-3 px-4 text-start">Official Email</th>
                      <th className="py-3 px-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-museum-divider">
                    {filteredFaculty.map((member) => (
                      <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-obsidian-elevated shrink-0 border border-gold/40">
                              <SafeImage src={member.avatarUrl} alt={member.name.en} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-parchment-pure truncate max-w-[200px]">
                                {member.name[locale] || member.name.ckb}
                              </span>
                              <span className="text-[11px] text-museum-secondary truncate">
                                {member.name.en}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-gold font-medium">
                          {member.role[locale] || member.role.ckb}
                        </td>

                        <td className="py-3 px-4 text-museum-secondary">
                          {member.department[locale] || member.department.ckb}
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-museum-secondary">
                          {member.contactEmail}
                        </td>

                        <td className="py-3 px-4 text-end">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              href={`/admin/faculty/${member.id}/edit`}
                              className="p-1.5 rounded-lg hover:bg-gold/15 text-museum-secondary hover:text-gold hover:shadow-gold-glow transition-all"
                              title={locale === 'ckb' ? 'دەستکاریکردنی زانیاری مامۆستا' : locale === 'ar' ? 'تعديل بيانات الأستاذ' : 'Edit Faculty Member'}
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>

                            <Link
                              href="/about/faculty"
                              className="p-1.5 rounded-lg hover:bg-white/10 text-museum-secondary hover:text-gold transition-colors"
                              title="Inspect Faculty Showcase"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => {
                                if (confirm(`Remove faculty member "${member.name.en}"?`)) {
                                  deleteFaculty(member.id);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-400/10 text-museum-secondary hover:text-red-400 transition-colors"
                              title="Remove Faculty Member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Visiting Artists & Collaborators Registry */}
        {activeTab === 'collaborators' && (
          <div className="flex flex-col gap-5 print:hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-obsidian-surface/60 border border-museum-border">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={collaboratorSearchQuery}
                  onChange={(e) => setCollaboratorSearchQuery(e.target.value)}
                  placeholder={locale === 'ckb' ? 'گەڕان لە هاوبەشەکاندا...' : 'Search visiting artists...'}
                  className="w-full ps-9 pe-4 py-2 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                />
                <Search className="w-4 h-4 text-museum-secondary absolute top-1/2 -translate-y-1/2 start-3" />
              </div>
            </div>

            <div className="rounded-3xl bg-obsidian-surface/80 border border-museum-border overflow-hidden shadow-art-card">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="border-b border-museum-divider bg-black/40 text-museum-secondary font-mono uppercase text-[10px]">
                      <th className="py-3 px-4 text-start">Collaborator / Artist</th>
                      <th className="py-3 px-4 text-start">Type & Year</th>
                      <th className="py-3 px-4 text-start">Country / Origin</th>
                      <th className="py-3 px-4 text-center">Photos</th>
                      <th className="py-3 px-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-museum-divider">
                    {filteredCollaborators.map((collab) => (
                      <tr key={collab.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-obsidian-elevated shrink-0 border border-gold/40">
                              <SafeImage src={collab.avatarUrl} alt={collab.name.en} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-parchment-pure truncate max-w-[200px]">
                                {collab.name[locale] || collab.name.ckb}
                              </span>
                              <span className="text-[11px] text-museum-secondary truncate">
                                {collab.artistTitle[locale] || collab.artistTitle.ckb}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-museum-secondary">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-gold/15 text-gold border border-gold/30">
                            {collab.collaborationTypeLabel[locale] || collab.collaborationTypeLabel.ckb} • {collab.collaborationYear}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-parchment font-mono">
                          {collab.country[locale] || collab.country.ckb}
                        </td>

                        <td className="py-3 px-4 text-center font-mono text-gold">
                          {collab.galleryPhotos?.length || 0} photos
                        </td>

                        <td className="py-3 px-4 text-end">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              href={`/admin/collaborators/${collab.id}/edit`}
                              className="p-1.5 rounded-lg hover:bg-gold/15 text-museum-secondary hover:text-gold hover:shadow-gold-glow transition-all"
                              title={locale === 'ckb' ? 'دەستکاریکردنی هونەرمەندی هاوبەش' : locale === 'ar' ? 'تعديل بيانات المتعاون' : 'Edit Collaborator'}
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>

                            <Link
                              href="/collaborators"
                              className="p-1.5 rounded-lg hover:bg-white/10 text-museum-secondary hover:text-gold transition-colors"
                              title="Inspect Collaborators Directory"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => {
                                if (confirm(`Remove collaborator "${collab.name.en}"?`)) {
                                  deleteCollaborator(collab.id);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-400/10 text-museum-secondary hover:text-red-400 transition-colors"
                              title="Delete Collaborator"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Batch QR Plaque Studio */}
        {activeTab === 'plaques' && (
          <QRBatchStudio artworks={artworks} />
        )}

        {/* Tab 7: Official Academic Departments Configuration */}
        {activeTab === 'departments' && (
          <DepartmentConfigEditor />
        )}

        {/* Tab 8: Virtual Gallery Settings & Ambient Multi-Track Audio Registry */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-6">
            {/* Header Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/60 border border-museum-border shadow-art-card flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center shadow-gold-glow-sm">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-gold font-mono tracking-widest uppercase block">
                    3D VIRTUAL TOUR AMBIENT PLAYLIST
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-parchment-pure font-serif">
                    {locale === 'ckb'
                      ? 'ڕێکخستنەکانی مۆسیقای باکگراوندی هۆڵی 3D'
                      : locale === 'ar'
                      ? 'إعدادات الموسيقى المحيطية للمعرض الافتراضي'
                      : 'Virtual Gallery Ambient Audio Registry'}
                  </h2>
                </div>
              </div>

              <span className="px-4 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-gold">
                {gallerySettings?.ambientTracks?.length || 0} {locale === 'ckb' ? 'تراک لە پێڕستدا' : 'Active Tracks'}
              </span>
            </div>

            {/* Upload New Track Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/60 border border-museum-border shadow-art-card flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-parchment-pure font-serif">
                    {locale === 'ckb' ? 'بارکردنی تراکی دەنگی نوێ' : 'Upload New Ambient Track'}
                  </h3>
                  <p className="text-xs text-museum-secondary">
                    {locale === 'ckb'
                      ? 'فایلی دەنگی لۆکاڵی (.mp3, .wav, .m4a) لە ئامێرەکەتەوە هەڵبژێرە یان لینک بنووسە'
                      : 'Upload local audio files or direct audio streaming links for the 3D gallery tour'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <FileUploadDropzone
                  mediaType="audio"
                  value={newTrackUrl}
                  fileName={newTrackFileName}
                  label={locale === 'ckb' ? 'فایلی دەنگی تراک' : 'Ambient Audio File'}
                  description={locale === 'ckb' ? 'فایلی دەنگی باکگراوندی هۆڵی 3D' : 'Background music track'}
                  onChange={(url, name) => {
                    setNewTrackUrl(url);
                    if (name) {
                      setNewTrackFileName(name);
                      if (!newTrackTitle) {
                        setNewTrackTitle(name.replace(/\.[^/.]+$/, ''));
                      }
                    }
                  }}
                />

                <div className="flex flex-col justify-between gap-5 p-6 rounded-2xl bg-black/40 border border-white/5 h-full">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-gold uppercase tracking-wider">
                      {locale === 'ckb' ? 'ناوی تراک (Track Title)' : 'Track Title'}
                    </label>
                    <input
                      type="text"
                      value={newTrackTitle}
                      onChange={(e) => setNewTrackTitle(e.target.value)}
                      placeholder={locale === 'ckb' ? 'نموونە: ئاوازی تاری کلاسیکی کوردی' : 'e.g. Kurdish Classical Ambient Strings'}
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-elevated border border-white/10 focus:border-gold text-parchment text-sm outline-none transition-colors"
                    />
                    <p className="text-[11px] text-museum-caption">
                      {locale === 'ckb'
                        ? 'ئەم ناونیشانە ڕاستەوخۆ لە مۆسیقاژەنی پێشانگای خەیاڵیدا بۆ سەردانکەران پیشاندەدرێت.'
                        : 'This title will be displayed in the glassmorphism music player inside the Virtual Tour.'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (!newTrackUrl.trim()) {
                        alert(locale === 'ckb' ? 'تکایە سەرەتا فایلی دەنگی باربکە!' : 'Please upload or provide an audio file first!');
                        return;
                      }
                      const title = newTrackTitle.trim() || newTrackFileName.replace(/\.[^/.]+$/, '') || `Ambient Track #${(gallerySettings?.ambientTracks?.length || 0) + 1}`;
                      const newTrack: AmbientTrack = {
                        id: `track-${Date.now()}`,
                        title,
                        url: newTrackUrl.trim(),
                      };
                      updateGallerySettings({
                        ambientTracks: [...(gallerySettings?.ambientTracks || []), newTrack],
                      });
                      setNewTrackTitle('');
                      setNewTrackUrl('');
                      setNewTrackFileName('');
                    }}
                    disabled={!newTrackUrl}
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow hover:shadow-gold-glow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{locale === 'ckb' ? 'زیادکردن بۆ پێڕستی مۆسیقای پێشانگا' : 'Add to Ambient Playlist'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Ambient Playlist List View */}
            <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/60 border border-museum-border shadow-art-card flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-museum-divider pb-4">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-gold" />
                  <h3 className="text-sm font-bold text-parchment-pure font-serif">
                    {locale === 'ckb' ? 'تراکە چالاکەکانی پێڕستی پێشانگا' : 'Active Playlist in 3D Gallery'}
                  </h3>
                </div>
                <span className="text-xs text-museum-secondary font-mono">
                  {gallerySettings?.ambientTracks?.length || 0} Tracks
                </span>
              </div>

              {gallerySettings?.ambientTracks && gallerySettings.ambientTracks.length > 0 ? (
                <div className="flex flex-col divide-y divide-museum-divider/60">
                  {gallerySettings.ambientTracks.map((track, idx) => (
                    <div
                      key={track.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors rounded-xl px-2"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold border border-gold/30 flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-sm font-bold text-parchment-pure truncate">
                            {track.title}
                          </h4>
                          <span className="text-[11px] font-mono text-museum-caption truncate max-w-md">
                            {track.url}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {/* Audio Preview Player with IndexedDB Resolution */}
                        <AdminTrackAudioPreview url={track.url} />

                        {/* Delete Track Button */}
                        <button
                          onClick={() => {
                            if (confirm(`Remove track "${track.title}" from ambient playlist?`)) {
                              updateGallerySettings({
                                ambientTracks: gallerySettings.ambientTracks.filter((t) => t.id !== track.id),
                              });
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-red-400/10 text-museum-secondary hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Track"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-museum-secondary border border-dashed border-white/10 rounded-2xl">
                  {locale === 'ckb'
                    ? 'هیچ تراکێکی دەنگی بۆ پێشانگاکە بەردەست نییە. لە سەرەوە دەتوانیت فایلی دەنگی زیاد بکەیت.'
                    : 'No ambient tracks cataloged. Upload audio files above to equip the 3D gallery with background music.'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminAuthGuard>
  );
}
