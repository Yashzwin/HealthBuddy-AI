import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DayNightLandscape from '@/components/DayNightLandscape';

const sampleProfiles = [
  {
    name: 'Young Child with Caregiver',
    age: 5,
    lifeStage: 'Child',
    dailySleepHours: 10,
    dailyWaterIntake: 4,
    dailyScreenTime: 1,
    dailyStudyHours: 0,
    dailyWorkSittingHours: 0,
    activityLevel: 'light',
    sportsExerciseLevel: 'light',
    postureConcer: 2,
    stressLevel: 1,
    breakFrequency: 'regularly',
    mealRegularity: 'very regular',
    outdoorTimeHours: 2,
    mobilityLevel: 'full',
    caregiverContext: 'Parent-guided routines',
  },
  {
    name: 'School Student',
    age: 10,
    lifeStage: 'Child',
    dailySleepHours: 8,
    dailyWaterIntake: 6,
    dailyScreenTime: 3,
    dailyStudyHours: 2,
    dailyWorkSittingHours: 0,
    activityLevel: 'moderate',
    sportsExerciseLevel: 'moderate',
    postureConcer: 3,
    stressLevel: 2,
    breakFrequency: 'sometimes',
    mealRegularity: 'very regular',
    outdoorTimeHours: 1.5,
    mobilityLevel: 'full',
    caregiverContext: 'School and home balance',
  },
  {
    name: 'Teen Exam Week',
    age: 16,
    lifeStage: 'Teen',
    dailySleepHours: 7,
    dailyWaterIntake: 4,
    dailyScreenTime: 4,
    dailyStudyHours: 3,
    dailyWorkSittingHours: 0,
    activityLevel: 'light',
    sportsExerciseLevel: 'light',
    postureConcer: 4,
    stressLevel: 4,
    breakFrequency: 'rarely',
    mealRegularity: 'somewhat regular',
    outdoorTimeHours: 0.5,
    mobilityLevel: 'full',
    caregiverContext: '',
  },
  {
    name: 'Teen Gamer',
    age: 15,
    lifeStage: 'Teen',
    dailySleepHours: 7,
    dailyWaterIntake: 4,
    dailyScreenTime: 6,
    dailyStudyHours: 1,
    dailyWorkSittingHours: 0,
    activityLevel: 'sedentary',
    sportsExerciseLevel: 'sedentary',
    postureConcer: 5,
    stressLevel: 3,
    breakFrequency: 'rarely',
    mealRegularity: 'irregular',
    outdoorTimeHours: 0.5,
    mobilityLevel: 'full',
    caregiverContext: '',
  },
  {
    name: 'College Student',
    age: 20,
    lifeStage: 'Young Adult',
    dailySleepHours: 6,
    dailyWaterIntake: 5,
    dailyScreenTime: 5,
    dailyStudyHours: 3,
    dailyWorkSittingHours: 0,
    activityLevel: 'light',
    sportsExerciseLevel: 'light',
    postureConcer: 4,
    stressLevel: 4,
    breakFrequency: 'sometimes',
    mealRegularity: 'irregular',
    outdoorTimeHours: 1,
    mobilityLevel: 'full',
    caregiverContext: '',
  },
  {
    name: 'Desk Worker',
    age: 35,
    lifeStage: 'Adult',
    dailySleepHours: 7,
    dailyWaterIntake: 5,
    dailyScreenTime: 8,
    dailyStudyHours: 0,
    dailyWorkSittingHours: 8,
    activityLevel: 'sedentary',
    sportsExerciseLevel: 'sedentary',
    postureConcer: 5,
    stressLevel: 4,
    breakFrequency: 'rarely',
    mealRegularity: 'somewhat regular',
    outdoorTimeHours: 0.5,
    mobilityLevel: 'full',
    caregiverContext: '',
  },
  {
    name: 'Busy Parent',
    age: 40,
    lifeStage: 'Adult',
    dailySleepHours: 6,
    dailyWaterIntake: 4,
    dailyScreenTime: 4,
    dailyStudyHours: 0,
    dailyWorkSittingHours: 0,
    activityLevel: 'light',
    sportsExerciseLevel: 'light',
    postureConcer: 3,
    stressLevel: 5,
    breakFrequency: 'rarely',
    mealRegularity: 'irregular',
    outdoorTimeHours: 1,
    mobilityLevel: 'full',
    caregiverContext: '',
  },
  {
    name: 'Active Athlete',
    age: 25,
    lifeStage: 'Young Adult',
    dailySleepHours: 8,
    dailyWaterIntake: 10,
    dailyScreenTime: 2,
    dailyStudyHours: 0,
    dailyWorkSittingHours: 0,
    activityLevel: 'active',
    sportsExerciseLevel: 'active',
    postureConcer: 2,
    stressLevel: 2,
    breakFrequency: 'regularly',
    mealRegularity: 'very regular',
    outdoorTimeHours: 3,
    mobilityLevel: 'full',
    caregiverContext: '',
  },
  {
    name: 'Older Adult Gentle',
    age: 70,
    lifeStage: 'Older Adult',
    dailySleepHours: 7,
    dailyWaterIntake: 6,
    dailyScreenTime: 2,
    dailyStudyHours: 0,
    dailyWorkSittingHours: 0,
    activityLevel: 'light',
    sportsExerciseLevel: 'light',
    postureConcer: 3,
    stressLevel: 2,
    breakFrequency: 'regularly',
    mealRegularity: 'very regular',
    outdoorTimeHours: 1.5,
    mobilityLevel: 'limited',
    caregiverContext: 'Some assistance needed',
  },
  {
    name: 'Family Wellness',
    age: 12,
    lifeStage: 'Child',
    dailySleepHours: 8,
    dailyWaterIntake: 6,
    dailyScreenTime: 2,
    dailyStudyHours: 2,
    dailyWorkSittingHours: 0,
    activityLevel: 'moderate',
    sportsExerciseLevel: 'moderate',
    postureConcer: 2,
    stressLevel: 2,
    breakFrequency: 'regularly',
    mealRegularity: 'very regular',
    outdoorTimeHours: 2,
    mobilityLevel: 'full',
    caregiverContext: 'Family wellness focus',
  },
];

const RoutineAssessmentPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    lifeStage: '',
    name: '',
    dailySleepHours: '',
    dailyWaterIntake: '',
    dailyScreenTime: '',
    dailyStudyHours: '',
    dailyWorkSittingHours: '',
    activityLevel: '',
    sportsExerciseLevel: '',
    postureConcer: '',
    stressLevel: '',
    breakFrequency: '',
    mealRegularity: '',
    outdoorTimeHours: '',
    mobilityLevel: '',
    caregiverContext: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const loadSampleProfile = (profile) => {
    setFormData({
      age: profile.age.toString(),
      lifeStage: profile.lifeStage,
      name: profile.name,
      dailySleepHours: profile.dailySleepHours.toString(),
      dailyWaterIntake: profile.dailyWaterIntake.toString(),
      dailyScreenTime: profile.dailyScreenTime.toString(),
      dailyStudyHours: profile.dailyStudyHours.toString(),
      dailyWorkSittingHours: profile.dailyWorkSittingHours.toString(),
      activityLevel: profile.activityLevel,
      sportsExerciseLevel: profile.sportsExerciseLevel,
      postureConcer: profile.postureConcer.toString(),
      stressLevel: profile.stressLevel.toString(),
      breakFrequency: profile.breakFrequency,
      mealRegularity: profile.mealRegularity,
      outdoorTimeHours: profile.outdoorTimeHours.toString(),
      mobilityLevel: profile.mobilityLevel,
      caregiverContext: profile.caregiverContext,
    });
    toast.success(`Loaded ${profile.name} profile`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.age) {
      toast.error('Age is required');
      return;
    }

    setLoading(true);

    try {
      const profileData = {
        userId: currentUser.id,
        age: parseFloat(formData.age),
        lifeStage: formData.lifeStage || '',
        name: formData.name || '',
        dailySleepHours: formData.dailySleepHours ? parseFloat(formData.dailySleepHours) : null,
        dailyWaterIntake: formData.dailyWaterIntake ? parseFloat(formData.dailyWaterIntake) : null,
        dailyScreenTime: formData.dailyScreenTime ? parseFloat(formData.dailyScreenTime) : null,
        dailyStudyHours: formData.dailyStudyHours ? parseFloat(formData.dailyStudyHours) : null,
        dailyWorkSittingHours: formData.dailyWorkSittingHours ? parseFloat(formData.dailyWorkSittingHours) : null,
        activityLevel: formData.activityLevel || '',
        sportsExerciseLevel: formData.sportsExerciseLevel || '',
        postureConcer: formData.postureConcer ? parseFloat(formData.postureConcer) : null,
        stressLevel: formData.stressLevel ? parseFloat(formData.stressLevel) : null,
        breakFrequency: formData.breakFrequency || '',
        mealRegularity: formData.mealRegularity || '',
        outdoorTimeHours: formData.outdoorTimeHours ? parseFloat(formData.outdoorTimeHours) : null,
        mobilityLevel: formData.mobilityLevel || '',
        caregiverContext: formData.caregiverContext || '',
      };

      const existingProfiles = await pb.collection('user_profiles').getFullList({
        filter: `userId = "${currentUser.id}"`,
        $autoCancel: false,
      });

      if (existingProfiles.length > 0) {
        await pb.collection('user_profiles').update(existingProfiles[0].id, profileData, { $autoCancel: false });
      } else {
        await pb.collection('user_profiles').create(profileData, { $autoCancel: false });
      }

      toast.success('Profile saved successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Routine Assessment - HealthBuddy AI</title>
        <meta name="description" content="Complete your wellness assessment to receive personalized daily routines and habit recommendations." />
      </Helmet>
      <Header />
      
      <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <DayNightLandscape variant="subtle" className="opacity-30" />
        <div className="relative z-10 container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Routine Assessment</CardTitle>
              <CardDescription>
                Tell us about your daily habits to receive personalized wellness recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Quick Start: Load a Sample Profile</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {sampleProfiles.map((profile, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => loadSampleProfile(profile)}
                      className="text-xs"
                    >
                      {profile.name}
                    </Button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age (required)</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className="text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lifeStage">Life Stage</Label>
                    <Select value={formData.lifeStage} onValueChange={(value) => handleSelectChange('lifeStage', value)}>
                      <SelectTrigger className="text-foreground">
                        <SelectValue placeholder="Select life stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Child">Child</SelectItem>
                        <SelectItem value="Teen">Teen</SelectItem>
                        <SelectItem value="Young Adult">Young Adult</SelectItem>
                        <SelectItem value="Adult">Adult</SelectItem>
                        <SelectItem value="Older Adult">Older Adult</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name (optional)</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailySleepHours">Daily Sleep (hours)</Label>
                    <Input
                      id="dailySleepHours"
                      name="dailySleepHours"
                      type="number"
                      step="0.5"
                      value={formData.dailySleepHours}
                      onChange={handleChange}
                      className="text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailyWaterIntake">Daily Water (cups)</Label>
                    <Input
                      id="dailyWaterIntake"
                      name="dailyWaterIntake"
                      type="number"
                      step="0.5"
                      value={formData.dailyWaterIntake}
                      onChange={handleChange}
                      className="text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailyScreenTime">Daily Screen Time (hours)</Label>
                    <Input
                      id="dailyScreenTime"
                      name="dailyScreenTime"
                      type="number"
                      step="0.5"
                      value={formData.dailyScreenTime}
                      onChange={handleChange}
                      className="text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailyStudyHours">Daily Study (hours)</Label>
                    <Input
                      id="dailyStudyHours"
                      name="dailyStudyHours"
                      type="number"
                      step="0.5"
                      value={formData.dailyStudyHours}
                      onChange={handleChange}
                      className="text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailyWorkSittingHours">Daily Work/Sitting (hours)</Label>
                    <Input
                      id="dailyWorkSittingHours"
                      name="dailyWorkSittingHours"
                      type="number"
                      step="0.5"
                      value={formData.dailyWorkSittingHours}
                      onChange={handleChange}
                      className="text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activityLevel">Activity Level</Label>
                    <Select value={formData.activityLevel} onValueChange={(value) => handleSelectChange('activityLevel', value)}>
                      <SelectTrigger className="text-foreground">
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sportsExerciseLevel">Sports/Exercise Level</Label>
                    <Select value={formData.sportsExerciseLevel} onValueChange={(value) => handleSelectChange('sportsExerciseLevel', value)}>
                      <SelectTrigger className="text-foreground">
                        <SelectValue placeholder="Select exercise level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postureConcer">Posture Concern (1-5)</Label>
                    <Input
                      id="postureConcer"
                      name="postureConcer"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.postureConcer}
                      onChange={handleChange}
                      className="text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stressLevel">Stress Level (1-5)</Label>
                    <Input
                      id="stressLevel"
                      name="stressLevel"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.stressLevel}
                      onChange={handleChange}
                      className="text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breakFrequency">Break Frequency</Label>
                    <Select value={formData.breakFrequency} onValueChange={(value) => handleSelectChange('breakFrequency', value)}>
                      <SelectTrigger className="text-foreground">
                        <SelectValue placeholder="Select break frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rarely">Rarely</SelectItem>
                        <SelectItem value="sometimes">Sometimes</SelectItem>
                        <SelectItem value="regularly">Regularly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mealRegularity">Meal Regularity</Label>
                    <Select value={formData.mealRegularity} onValueChange={(value) => handleSelectChange('mealRegularity', value)}>
                      <SelectTrigger className="text-foreground">
                        <SelectValue placeholder="Select meal regularity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="irregular">Irregular</SelectItem>
                        <SelectItem value="somewhat regular">Somewhat Regular</SelectItem>
                        <SelectItem value="very regular">Very Regular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outdoorTimeHours">Outdoor Time (hours/day)</Label>
                    <Input
                      id="outdoorTimeHours"
                      name="outdoorTimeHours"
                      type="number"
                      step="0.5"
                      value={formData.outdoorTimeHours}
                      onChange={handleChange}
                      className="text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobilityLevel">Mobility Level</Label>
                    <Select value={formData.mobilityLevel} onValueChange={(value) => handleSelectChange('mobilityLevel', value)}>
                      <SelectTrigger className="text-foreground">
                        <SelectValue placeholder="Select mobility level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="limited">Limited</SelectItem>
                        <SelectItem value="assisted">Assisted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="caregiverContext">Caregiver Support Context</Label>
                    <Input
                      id="caregiverContext"
                      name="caregiverContext"
                      type="text"
                      value={formData.caregiverContext}
                      onChange={handleChange}
                      placeholder="e.g., Parent-guided routines, Family wellness focus"
                      className="text-foreground"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Profile & Continue'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RoutineAssessmentPage;