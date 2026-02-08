'use client'

import { useState } from 'react'
import { Upload, Video, CheckCircle, Youtube, Calendar, Hash, FileText, Image as ImageIcon, Sparkles } from 'lucide-react'

interface VideoProject {
  id: string
  title: string
  description: string
  tags: string[]
  thumbnail: string
  status: 'planning' | 'scripting' | 'recording' | 'editing' | 'ready' | 'uploaded'
  scheduledDate?: string
}

export default function Home() {
  const [step, setStep] = useState(1)
  const [projects, setProjects] = useState<VideoProject[]>([])
  const [currentProject, setCurrentProject] = useState<Partial<VideoProject>>({
    title: '',
    description: '',
    tags: [],
    status: 'planning'
  })
  const [tagInput, setTagInput] = useState('')

  const addProject = () => {
    if (currentProject.title) {
      const newProject: VideoProject = {
        id: Date.now().toString(),
        title: currentProject.title,
        description: currentProject.description || '',
        tags: currentProject.tags || [],
        thumbnail: currentProject.thumbnail || '',
        status: 'planning',
        scheduledDate: currentProject.scheduledDate
      }
      setProjects([...projects, newProject])
      setCurrentProject({ title: '', description: '', tags: [], status: 'planning' })
      setTagInput('')
    }
  }

  const updateProjectStatus = (id: string, status: VideoProject['status']) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status } : p))
  }

  const addTag = () => {
    if (tagInput && currentProject.tags && !currentProject.tags.includes(tagInput)) {
      setCurrentProject({
        ...currentProject,
        tags: [...(currentProject.tags || []), tagInput]
      })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setCurrentProject({
      ...currentProject,
      tags: currentProject.tags?.filter(t => t !== tag)
    })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-gray-500',
      scripting: 'bg-blue-500',
      recording: 'bg-purple-500',
      editing: 'bg-yellow-500',
      ready: 'bg-green-500',
      uploaded: 'bg-emerald-600'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Youtube className="w-12 h-12 text-red-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">YouTube Automation Hub</h1>
          </div>
          <p className="text-gray-600 text-lg">Complete YouTube channel management system - from planning to upload</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            {[
              { num: 1, label: 'Planning', icon: FileText },
              { num: 2, label: 'Content Creation', icon: Video },
              { num: 3, label: 'Optimization', icon: Sparkles },
              { num: 4, label: 'Upload & Schedule', icon: Upload }
            ].map(({ num, label, icon: Icon }) => (
              <div key={num} className="flex items-center gap-2">
                <button
                  onClick={() => setStep(num)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    step === num
                      ? 'bg-red-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{num}. {label}</span>
                </button>
                {num < 4 && <div className="hidden md:block w-8 h-0.5 bg-gray-300" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel - Input Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <Video className="w-6 h-6 text-red-600" />
              {step === 1 ? 'Plan Your Video' :
               step === 2 ? 'Create Content' :
               step === 3 ? 'Optimize Details' :
               'Upload & Schedule'}
            </h2>

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Video Title *</label>
                  <input
                    type="text"
                    value={currentProject.title}
                    onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                    placeholder="Enter your video title..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Video Description</label>
                  <textarea
                    value={currentProject.description}
                    onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                    placeholder="Describe your video content..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Hash className="w-4 h-4 inline mr-1" />
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add tags..."
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.tags?.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-2"
                      >
                        #{tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-900">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={addProject}
                  disabled={!currentProject.title}
                  className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Create Video Project
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                  <Video className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Content Creation Stage</h3>
                  <p className="text-gray-600 mb-4">Record or upload your video content</p>
                  <div className="space-y-3">
                    <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                      Start Screen Recording
                    </button>
                    <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
                      Upload Video File
                    </button>
                    <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                      Import from Device
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-1" />
                    Thumbnail
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-500 transition cursor-pointer">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600">Click to upload thumbnail</p>
                    <p className="text-sm text-gray-400 mt-1">1280x720 recommended</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Optimization</label>
                  <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Auto-Generate SEO Tags
                  </button>
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Optimization Checklist</h4>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Title optimized for search
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Description includes keywords
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> 5+ relevant tags added
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Schedule Upload
                  </label>
                  <input
                    type="datetime-local"
                    value={currentProject.scheduledDate}
                    onChange={(e) => setCurrentProject({ ...currentProject, scheduledDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Upload Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5" defaultChecked />
                      <span>Made for kids</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5" defaultChecked />
                      <span>Enable comments</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5" />
                      <span>Age restricted</span>
                    </label>
                  </div>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:from-red-700 hover:to-pink-700 transition shadow-lg flex items-center justify-center gap-2">
                  <Upload className="w-6 h-6" />
                  Upload to YouTube
                </button>
              </div>
            )}
          </div>

          {/* Right Panel - Projects List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Your Video Projects ({projects.length})
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {projects.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No video projects yet</p>
                  <p className="text-sm">Create your first project to get started</p>
                </div>
              ) : (
                projects.map(project => (
                  <div key={project.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-300 transition">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-800">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {project.status.toUpperCase()}
                      </span>
                    </div>

                    {project.description && (
                      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                    )}

                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.scheduledDate && (
                      <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(project.scheduledDate).toLocaleString()}
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {project.status !== 'uploaded' && (
                        <>
                          {project.status === 'planning' && (
                            <button
                              onClick={() => updateProjectStatus(project.id, 'scripting')}
                              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                            >
                              Start Script
                            </button>
                          )}
                          {project.status === 'scripting' && (
                            <button
                              onClick={() => updateProjectStatus(project.id, 'recording')}
                              className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition"
                            >
                              Start Recording
                            </button>
                          )}
                          {project.status === 'recording' && (
                            <button
                              onClick={() => updateProjectStatus(project.id, 'editing')}
                              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition"
                            >
                              Start Editing
                            </button>
                          )}
                          {project.status === 'editing' && (
                            <button
                              onClick={() => updateProjectStatus(project.id, 'ready')}
                              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
                            >
                              Mark Ready
                            </button>
                          )}
                          {project.status === 'ready' && (
                            <button
                              onClick={() => updateProjectStatus(project.id, 'uploaded')}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition flex items-center gap-1"
                            >
                              <Upload className="w-4 h-4" />
                              Upload Now
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-red-600">{projects.length}</p>
              <p className="text-sm text-gray-600">Total Projects</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">{projects.filter(p => p.status === 'planning' || p.status === 'scripting').length}</p>
              <p className="text-sm text-gray-600">In Planning</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">{projects.filter(p => p.status === 'recording').length}</p>
              <p className="text-sm text-gray-600">Recording</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-600">{projects.filter(p => p.status === 'editing').length}</p>
              <p className="text-sm text-gray-600">Editing</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{projects.filter(p => p.status === 'uploaded').length}</p>
              <p className="text-sm text-gray-600">Uploaded</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
