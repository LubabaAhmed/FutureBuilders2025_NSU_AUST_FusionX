
import { Shelter, Broadcast, FirstAidStep } from './types';

export const STRINGS = {
  app_name: 'হিলশিল্ড (HillShield)',
  nav_map: 'মানচিত্র',
  nav_mesh: 'মেস নেটওয়ার্ক',
  nav_alerts: 'সতর্কতা',
  nav_doctor: 'এআই সহকারী',
  nav_firstaid: 'প্রাথমিক চিকিৎসা',
  nav_profile: 'প্রোফাইল',
  sos_button: 'জরুরি সাহায্য (SOS)',
  sos_title: 'জরুরি অবস্থা সক্রিয় করুন',
  sos_desc: 'আপনার অবস্থান সরাসরি কর্তৃপক্ষ এবং নিকটস্থ উদ্ধারকারীদের সাথে শেয়ার করা হবে।',
  medical_history: 'চিকিৎসা ইতিহাস',
  blood_group: 'রক্তের গ্রুপ',
  allergies: 'অ্যালার্জি',
  conditions: 'দীর্ঘস্থায়ী রোগ',
  medications: 'বর্তমান ওষুধ',
  signal_status: 'সিগন্যাল শক্তি',
};

export const MOCK_SHELTERS: Shelter[] = [
  { id: '1', name: 'রাঙ্গামাটি জেনারেল হাসপাতাল', type: 'hospital', lat: 22.6485, lng: 92.1747, capacity: 500, currentOccupancy: 420 },
  { id: '2', name: 'কাপ্তাই প্রাথমিক বিদ্যালয় আশ্রয়কেন্দ্র', type: 'shelter', lat: 22.5005, lng: 92.2173, capacity: 300, currentOccupancy: 120 },
  { id: '3', name: 'সেফ জোন আলফা - সাজেক ভ্যালি', type: 'safe-zone', lat: 23.3855, lng: 92.2905, capacity: 1000, currentOccupancy: 150 },
  { id: '4', name: 'বান্দরবান মেডিকেল কলেজ', type: 'hospital', lat: 22.1936, lng: 92.2179, capacity: 400, currentOccupancy: 380 },
];

export const MOCK_BROADCASTS: Broadcast[] = [
  { id: 'b1', authority: 'জরুরি রেসপন্স বিডি', message: 'পার্বত্য চট্টগ্রামে ভারী বৃষ্টির পূর্বাভাস। ভূমিধস প্রবণ এলাকা এড়িয়ে চলুন।', type: 'warning', timestamp: Date.now() - 3600000 },
  { id: 'b2', authority: 'বন্যা নিয়ন্ত্রণ বিভাগ', message: 'কাপ্তাই হ্রদে পানির স্তর বাড়ছে। নিচু এলাকার বাসিন্দাদের নিরাপদ স্থানে সরে যেতে বলা হচ্ছে।', type: 'critical', timestamp: Date.now() - 7200000 },
];

export const FIRST_AID_DATA: FirstAidStep[] = [
  {
    id: '1',
    title: 'অতিরিক্ত রক্তক্ষরণ',
    category: 'injury',
    description: 'ক্ষতস্থান থেকে দ্রুত রক্তক্ষরণ বন্ধ করতে এই পদক্ষেপগুলো নিন।',
    steps: [
      'ক্ষতস্থানে পরিষ্কার কাপড় দিয়ে সরাসরি চাপ দিন।',
      'ক্ষতস্থানটি হৃৎপিণ্ডের স্তরের উপরে রাখুন।',
      'রক্তক্ষরণ বন্ধ না হলে আরও কাপড় যোগ করুন কিন্তু আগেরটি সরাবেন না।',
      'জরুরি সাহায্যের জন্য অপেক্ষা করুন।'
    ]
  },
  {
    id: '2',
    title: 'ভূমিধস নিরাপত্তা',
    category: 'natural-disaster',
    description: 'ভূমিধসের সময় বা পরে আপনার করণীয়।',
    steps: [
      'দ্রুত পাহাড়ের ঢাল থেকে দূরে সরে যান।',
      'বাড়ির ভেতরে থাকলে শক্ত আসবাবের নিচে আশ্রয় নিন।',
      'নদী বা নালা থেকে দূরে থাকুন কারণ সেখানে কাদা প্রবাহ হতে পারে।',
      'আশ্রয়কেন্দ্রে যাওয়ার সময় রেডিও বা ফোনের মাধ্যমে সতর্কতা শুনুন।'
    ]
  },
  {
    id: '3',
    title: 'সিপিআর (CPR)',
    category: 'medical',
    description: 'শ্বাসকষ্ট বা হৃদস্পন্দন বন্ধ হয়ে গেলে করণীয়।',
    steps: [
      'ব্যক্তিকে শক্ত জায়গায় শুইয়ে দিন।',
      'বুকের মাঝখানে দুই হাত দিয়ে জোরে চাপ দিন (প্রতি মিনিটে ১০০-১২০ বার)।',
      'প্রতিটি চাপের পর বুক স্বাভাবিক হতে দিন।',
      'পেশাদার সাহায্য না আসা পর্যন্ত চালিয়ে যান।'
    ]
  }
];
