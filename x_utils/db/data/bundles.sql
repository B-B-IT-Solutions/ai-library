DO $SEED$
DECLARE
  v_product_id uuid;
BEGIN

  -- =============================================
  -- Bundle 1: Developer Essentials Bundle
  -- =============================================
  INSERT INTO product (name, description, price, discount_amount, type, status)
  VALUES (
    'Developer Essentials Bundle',
    'Complete toolkit for developers including code review, SQL generation, and bug reporting templates. Save 30%!',
    19.99, 9.98, 'BUNDLE', 'ACTIVE'
  ) RETURNING id INTO v_product_id;

  INSERT INTO product_feature (product_id, icon, title, description, "order") VALUES
    (v_product_id, 'Code2',     'Complete Dev Toolkit', 'Everything you need for modern software development',       0),
    (v_product_id, 'GitBranch', 'Code Review Ready',    'Professional templates for code reviews and feedback',     1),
    (v_product_id, 'Database',  'SQL Generation',        'Create optimized SQL queries with AI assistance',         2),
    (v_product_id, 'Bug',       'Bug Tracking',          'Structured bug reports that developers love',             3);

  INSERT INTO product_use_case (product_id, category, description, tags, "order") VALUES
    (v_product_id, 'Software Development', 'Streamline code reviews and quality assurance',  ARRAY['code-review', 'quality', 'collaboration'], 0),
    (v_product_id, 'Database Management',  'Generate complex SQL queries efficiently',        ARRAY['database', 'sql', 'queries'],              1),
    (v_product_id, 'Bug Reporting',        'Create detailed, actionable bug reports',         ARRAY['debugging', 'testing', 'qa'],              2);

  INSERT INTO product_instruction (product_id, step, title, description) VALUES
    (v_product_id, 1, 'Choose a Template',         'Select the template that fits your current task'),
    (v_product_id, 2, 'Customize for Your Project','Adapt the template to your specific project needs'),
    (v_product_id, 3, 'Generate with AI',          'Use your AI assistant to process the prompt'),
    (v_product_id, 4, 'Integrate Results',          'Apply the output to your development workflow');

  -- =============================================
  -- Bundle 2: Content Creator Pro Bundle
  -- =============================================
  INSERT INTO product (name, description, price, discount_amount, type, status)
  VALUES (
    'Content Creator Pro Bundle',
    'Everything you need for content creation: blog posts, documentation, and professional emails. Save 25%!',
    22.99, 6.98, 'BUNDLE', 'ACTIVE'
  ) RETURNING id INTO v_product_id;

  INSERT INTO product_feature (product_id, icon, title, description, "order") VALUES
    (v_product_id, 'FileText', 'Content Creation Suite',  'Complete toolkit for professional content creation', 0),
    (v_product_id, 'BookOpen', 'Technical Documentation', 'Create clear, comprehensive technical docs',         1),
    (v_product_id, 'Mail',     'Professional Emails',     'Craft polished, effective email responses',          2),
    (v_product_id, 'PenTool',  'Blog Writing',            'Structured outlines for engaging blog posts',        3);

  INSERT INTO product_use_case (product_id, category, description, tags, "order") VALUES
    (v_product_id, 'Content Writing', 'Create engaging blog posts and articles',         ARRAY['blogging', 'writing', 'content'],           0),
    (v_product_id, 'Documentation',   'Write clear technical documentation',             ARRAY['docs', 'technical-writing', 'guides'],      1),
    (v_product_id, 'Communication',   'Professional email responses and correspondence', ARRAY['email', 'communication', 'business'],       2);

  INSERT INTO product_instruction (product_id, step, title, description) VALUES
    (v_product_id, 1, 'Select Content Type', 'Choose the template for your content needs'),
    (v_product_id, 2, 'Define Your Topic',   'Specify your subject matter and target audience'),
    (v_product_id, 3, 'Generate Content',    'Use AI to create your first draft'),
    (v_product_id, 4, 'Edit and Publish',    'Refine the output and publish your content');

  -- =============================================
  -- Bundle 3: Business Productivity Bundle
  -- =============================================
  INSERT INTO product (name, description, price, discount_amount, type, status)
  VALUES (
    'Business Productivity Bundle',
    'Boost your productivity with meeting summaries, user stories, and professional communication templates.',
    21.99, 7.98, 'BUNDLE', 'ACTIVE'
  ) RETURNING id INTO v_product_id;

  INSERT INTO product_feature (product_id, icon, title, description, "order") VALUES
    (v_product_id, 'Briefcase',    'Business Productivity',     'Essential tools for modern business operations',               0),
    (v_product_id, 'Users',        'Meeting Management',        'Transform meeting notes into actionable summaries',            1),
    (v_product_id, 'ListTodo',     'User Story Creation',       'Generate clear, comprehensive user stories',                   2),
    (v_product_id, 'MessageSquare','Professional Communication','Polished email responses and business correspondence',         3);

  INSERT INTO product_use_case (product_id, category, description, tags, "order") VALUES
    (v_product_id, 'Meeting Management',   'Summarize meetings and extract action items', ARRAY['meetings', 'notes', 'productivity'],       0),
    (v_product_id, 'Agile Development',    'Create well-structured user stories',         ARRAY['agile', 'user-stories', 'requirements'],   1),
    (v_product_id, 'Business Communication','Professional email templates and responses', ARRAY['email', 'business', 'communication'],      2);

  INSERT INTO product_instruction (product_id, step, title, description) VALUES
    (v_product_id, 1, 'Choose Your Tool', 'Select the template that matches your task'),
    (v_product_id, 2, 'Input Your Data',  'Provide the necessary context and information'),
    (v_product_id, 3, 'Generate Output',  'Let AI create your structured output'),
    (v_product_id, 4, 'Apply to Work',    'Use the output in your business workflow');

END;
$SEED$;
