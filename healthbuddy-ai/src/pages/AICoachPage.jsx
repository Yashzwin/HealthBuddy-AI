import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const quickQuestions = [
  'How can I reduce screen fatigue?',
  'How do I remember to drink more water?',
  'How can I improve posture while studying?',
  'What are simple movement breaks I can do?',
  'How can a caregiver help a child build healthy habits?',
  'What are safe gentle routine ideas for older adults?',
];

const AICoachPage = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversationHistory();
  }, [currentUser]);

  const loadConversationHistory = async () => {
    try {
      const records = await pb.collection('coach_conversations').getFullList({
        filter: `userId = "${currentUser.id}"`,
        sort: 'created',
        $autoCancel: false,
      });

      const loadedMessages = [];
      records.forEach(record => {
        if (record.userMessage) {
          loadedMessages.push({ role: 'user', content: record.userMessage });
        }
        if (record.aiResponse) {
          loadedMessages.push({ role: 'assistant', content: record.aiResponse });
        }
      });

      setMessages(loadedMessages);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('chest pain') || lowerMessage.includes('breathing') || lowerMessage.includes('severe') || lowerMessage.includes('emergency')) {
      return "I notice you mentioned a serious health concern. Please contact a healthcare professional or emergency services immediately. I can only help with general wellness habits, not medical emergencies.";
    }

    if (lowerMessage.includes('diagnose') || lowerMessage.includes('medication') || lowerMessage.includes('prescribe')) {
      return "I cannot provide medical diagnosis or prescribe medication. For medical concerns, please consult a qualified healthcare professional. I can help with daily wellness habits and routines.";
    }

    if (lowerMessage.includes('screen fatigue') || lowerMessage.includes('eye strain')) {
      return "To reduce screen fatigue, try the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds. Also, adjust screen brightness to match your environment, position your screen at arm's length, and take regular breaks. Consider using blue light filters in the evening.";
    }

    if (lowerMessage.includes('water') || lowerMessage.includes('hydration')) {
      return "Great question about hydration! Try these tips: Keep a water bottle visible on your desk, set hourly reminders on your phone, drink a glass of water with each meal, and track your intake in the habit tracker. Aim for 8 glasses per day, adjusting for activity level and climate.";
    }

    if (lowerMessage.includes('posture')) {
      return "Good posture while studying or working is important. Sit with your back against the chair, feet flat on the floor, and screen at eye level. Your elbows should be at 90 degrees. Take breaks every 30 minutes to stand and stretch. Consider a lumbar support cushion if needed.";
    }

    if (lowerMessage.includes('movement') || lowerMessage.includes('break')) {
      return "Simple movement breaks you can do: desk stretches (neck rolls, shoulder shrugs), standing up and walking around for 2 minutes, gentle arm circles, calf raises while standing, or a quick walk outside. Even 5 minutes every hour makes a difference.";
    }

    if (lowerMessage.includes('caregiver') || lowerMessage.includes('child')) {
      return "Caregivers can help children build healthy habits by: creating consistent routines, making hydration fun with colorful water bottles, setting screen time limits together, planning outdoor activities, modeling healthy behaviors, and celebrating small wins. Keep it positive and age-appropriate.";
    }

    if (lowerMessage.includes('older adult') || lowerMessage.includes('senior') || lowerMessage.includes('elderly')) {
      return "Safe gentle routines for older adults include: seated stretches, short walks at a comfortable pace, chair exercises, regular hydration reminders, consistent meal times, and adequate rest. Always consult with a healthcare provider before starting new activities, especially if there are mobility concerns.";
    }

    if (lowerMessage.includes('sleep') || lowerMessage.includes('bedtime')) {
      return "For better sleep: maintain a consistent bedtime, reduce screen time 1 hour before bed, keep your bedroom cool and dark, avoid caffeine in the afternoon, and create a calming bedtime routine. Aim for 7-9 hours for adults, more for children and teens.";
    }

    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety')) {
      return "To manage daily stress: practice deep breathing (4 counts in, 4 counts hold, 4 counts out), take regular breaks, spend time outdoors, maintain social connections, and ensure adequate sleep. If stress feels overwhelming, please speak with a mental health professional.";
    }

    return "I'm here to help with wellness habits like hydration, movement, posture, sleep routines, and daily planning. What specific wellness habit would you like to improve? Remember, for medical concerns, always consult a healthcare professional.";
  };

  const handleSend = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = generateResponse(messageText);
      const assistantMessage = { role: 'assistant', content: aiResponse };
      setMessages(prev => [...prev, assistantMessage]);

      const today = new Date().toISOString().split('T')[0];
      await pb.collection('coach_conversations').create({
        userId: currentUser.id,
        conversationDate: today,
        userMessage: messageText,
        aiResponse: aiResponse,
      }, { $autoCancel: false });
    } catch (error) {
      console.error('Error saving conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    handleSend(question);
  };

  return (
    <>
      <Helmet>
        <title>AI Coach - HealthBuddy AI</title>
        <meta name="description" content="Get personalized wellness advice from your AI wellness coach." />
      </Helmet>
      <Header />
      
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">AI Wellness Coach</h1>
            <p className="text-muted-foreground">
              Ask questions about hydration, posture, movement, sleep, and daily wellness habits
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left justify-start h-auto py-3 px-4"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-0">
              <ScrollArea className="h-[500px] p-6">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation by asking a question or selecting a quick question above.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-primary" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-secondary" />
                          </div>
                        )}
                      </div>
                    ))}
                    {loading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <div className="bg-muted rounded-2xl px-4 py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about wellness habits..."
                  disabled={loading}
                  className="text-foreground"
                />
                <Button type="submit" disabled={loading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6 border-2 border-destructive/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 text-destructive">Safety Notice</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This AI coach provides general wellness guidance only. It cannot diagnose medical conditions, prescribe medication, or replace healthcare professionals. For chest pain, breathing issues, severe distress, or any medical emergency, contact emergency services immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AICoachPage;