
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create texts table
CREATE TABLE texts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  chapters INTEGER NOT NULL,
  verses INTEGER NOT NULL,
  image_url TEXT,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verses table
CREATE TABLE verses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  text_id UUID REFERENCES texts(id) ON DELETE CASCADE,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  sanskrit TEXT NOT NULL,
  transliteration TEXT,
  english_translation TEXT,
  hindi_translation TEXT,
  commentary TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(text_id, chapter, verse)
);

-- Create dictionary table
CREATE TABLE dictionary (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  word TEXT NOT NULL,
  transliteration TEXT,
  meaning TEXT NOT NULL,
  definition TEXT,
  part_of_speech TEXT,
  etymology TEXT,
  usage_examples TEXT[],
  related_words TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_history table for tracking user interactions
CREATE TABLE user_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'translation', 'search', 'text_view'
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_items table for bookmarks
CREATE TABLE saved_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'verse', 'definition', 'translation'
  item_id UUID,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- Insert sample texts data
INSERT INTO texts (slug, title, category, description, chapters, verses, image_url) VALUES
('bhagavad-gita', 'Bhagavad Gita', 'Philosophy', 'The sacred dialogue between Krishna and Arjuna, offering guidance on ethics, duty and spiritual wisdom.', 18, 700, '/placeholder.svg'),
('ramayana', 'Ramayana', 'Epic', 'The epic tale of Prince Rama''s journey, exemplifying duty, courage, and righteousness.', 7, 24000, '/placeholder.svg'),
('mahabharata', 'Mahabharata', 'Epic', 'One of the two major Sanskrit epics of ancient India, the other being the Ramayana.', 18, 100000, '/placeholder.svg'),
('upanishads', 'Upanishads', 'Philosophy', 'Philosophical texts exploring concepts of reality, consciousness, and the nature of existence.', 108, 10000, '/placeholder.svg'),
('vedas', 'Vedas', 'Scripture', 'The oldest scriptures of Hinduism, containing hymns, philosophy, and guidance.', 4, 20000, '/placeholder.svg'),
('yoga-sutras', 'Yoga Sutras of Patanjali', 'Philosophy', 'Foundational text of yoga philosophy, outlining the eight limbs of yoga practice.', 4, 196, '/placeholder.svg');

-- Insert sample dictionary entries
INSERT INTO dictionary (word, transliteration, meaning, definition, part_of_speech, etymology, usage_examples) VALUES
('dharma', 'dharma', 'righteousness, duty', 'The principle of cosmic order and individual duty in Hindu philosophy', 'noun', 'From Sanskrit root "dhr" meaning to hold or maintain', ARRAY['Follow your dharma', 'The dharma of a king is to protect his subjects']),
('karma', 'karma', 'action, deed', 'The law of cause and effect governing moral actions and their consequences', 'noun', 'From Sanskrit root "kr" meaning to do or make', ARRAY['Good karma leads to positive results', 'Every action creates karma']),
('moksha', 'moksha', 'liberation, release', 'The ultimate goal of human life - liberation from the cycle of rebirth', 'noun', 'From Sanskrit root "muc" meaning to release or free', ARRAY['The seeker attained moksha', 'Moksha is the highest spiritual achievement']),
('yoga', 'yoga', 'union, discipline', 'The practice of physical, mental, and spiritual disciplines to achieve union with the divine', 'noun', 'From Sanskrit root "yuj" meaning to unite or join', ARRAY['Daily yoga practice', 'Yoga leads to self-realization']);

-- Insert sample verses (Bhagavad Gita Chapter 1, Verse 1)
INSERT INTO verses (text_id, chapter, verse, sanskrit, transliteration, english_translation, hindi_translation, commentary) VALUES
((SELECT id FROM texts WHERE slug = 'bhagavad-gita'), 1, 1, 
'धृतराष्ट्र उवाच । धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः । मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥', 
'dhṛtarāṣṭra uvāca dharmakṣetre kurukṣetre samavetā yuyutsavaḥ māmakāḥ pāṇḍavāścaiva kimakurvata sañjaya',
'Dhritarashtra said: On the holy field of Kurukshetra, when my sons and the sons of Pandu assembled together eager for battle, what did they do, O Sanjaya?',
'धृतराष्ट्र ने कहा: हे संजय! धर्मभूमि कुरुक्षेत्र में युद्ध की इच्छा से एकत्रित हुए मेरे और पाण्डु के पुत्रों ने क्या किया?',
'This opening verse sets the stage for the entire Bhagavad Gita, introducing the blind king Dhritarashtra asking his minister Sanjaya about the events at Kurukshetra.'
);

-- Create indexes for better performance
CREATE INDEX idx_texts_category ON texts(category);
CREATE INDEX idx_texts_slug ON texts(slug);
CREATE INDEX idx_verses_text_id ON verses(text_id);
CREATE INDEX idx_verses_chapter_verse ON verses(chapter, verse);
CREATE INDEX idx_dictionary_word ON dictionary(word);
CREATE INDEX idx_user_history_user_id ON user_history(user_id);
CREATE INDEX idx_saved_items_user_id ON saved_items(user_id);

-- Enable Row Level Security
ALTER TABLE texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE dictionary ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to texts, verses, and dictionary
CREATE POLICY "Allow public read access to texts" ON texts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to verses" ON verses FOR SELECT USING (true);
CREATE POLICY "Allow public read access to dictionary" ON dictionary FOR SELECT USING (true);

-- Create policies for user-specific data
CREATE POLICY "Users can view their own history" ON user_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own history" ON user_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own saved items" ON saved_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own saved items" ON saved_items FOR ALL USING (auth.uid() = user_id);
