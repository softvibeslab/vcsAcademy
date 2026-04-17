import React from 'react';
import { MessageSquare, Calendar, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const QASessionsPage = () => {
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: 'How do I handle the price objection?',
      answer: 'Focus on value instead of price. Show them the long-term benefits and ROI of their vacation ownership.',
      author: 'Maria Garcia',
      date: '2026-04-08',
      upvotes: 24
    },
    {
      id: 2,
      question: 'Best approach for skeptical customers?',
      answer: 'Build trust first. Share testimonials, show social proof, and be transparent about everything.',
      author: 'John Smith',
      date: '2026-04-07',
      upvotes: 18
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      const newQuestion = {
        id: questions.length + 1,
        question,
        answer: null,
        author: 'You',
        date: new Date().toISOString().split('T')[0],
        upvotes: 0
      };
      setQuestions([newQuestion, ...questions]);
      setQuestion('');
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-sm p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-[#D4AF37]/10 rounded-sm">
            <MessageSquare className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#F8FAFC]">Q&A Sessions</h1>
            <p className="text-[#94A3B8] mt-1">Ask questions and get expert answers</p>
          </div>
        </div>

        {/* Ask Question Form */}
        <div className="bg-white/5 border border-white/10 rounded-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Ask a Question</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              className="w-full bg-[#0A0A0B] border border-white/10 rounded-sm p-4 text-[#F8FAFC] placeholder-[#94A3B8] min-h-[100px] resize-y"
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#D4AF37] text-black px-6 py-2 rounded-sm font-medium hover:bg-[#D4AF37]/80 transition-colors"
              >
                <Send className="w-4 h-4" />
                Submit Question
              </button>
            </div>
          </form>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Recent Questions</h2>
          {questions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-sm p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">{q.question}</h3>
                  {q.answer ? (
                    <div className="bg-[#0A0A0B] rounded-sm p-4 mt-4">
                      <p className="text-[#F8FAFC]">{q.answer}</p>
                    </div>
                  ) : (
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-sm p-4 mt-4">
                      <p className="text-[#D4AF37]">Pending answer from expert...</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {q.date}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{q.author}</span>
                </div>
                {q.upvotes > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#D4AF37]">↑</span>
                    <span>{q.upvotes} upvotes</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default QASessionsPage;
