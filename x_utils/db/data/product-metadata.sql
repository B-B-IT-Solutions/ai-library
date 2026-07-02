DO $SEED$
DECLARE
  v_rec RECORD;
BEGIN
  FOR v_rec IN SELECT id, name FROM product WHERE type = 'TEMPLATE' LOOP

    INSERT INTO product_feature (product_id, icon, title, description, "order") VALUES
      (v_rec.id, 'Sparkles', 'AI-Powered',     'Optimized for modern AI models like Claude and GPT',      0),
      (v_rec.id, 'Zap',      'Quick Setup',     'Ready to use with minimal configuration',                 1),
      (v_rec.id, 'Target',   'Precise Results', 'Structured prompts for consistent, high-quality output',  2);

    INSERT INTO product_use_case (product_id, category, description, tags, "order") VALUES
      (v_rec.id, 'Development', 'Use ' || v_rec.name || ' to streamline your workflow', ARRAY['productivity', 'automation'], 0);

    INSERT INTO product_example (product_id, title, content, "order") VALUES
      (v_rec.id, 'Quick Start Example', 'See template content for detailed examples', 0);

    INSERT INTO product_instruction (product_id, step, title, description) VALUES
      (v_rec.id, 1, 'Copy Template',       'Copy the template content to your clipboard'),
      (v_rec.id, 2, 'Customize Variables', 'Replace placeholders with your specific information'),
      (v_rec.id, 3, 'Run Prompt',          'Paste into your AI assistant and get results'),
      (v_rec.id, 4, 'Refine Output',       'Adjust the prompt based on your needs');

  END LOOP;
END;
$SEED$;
