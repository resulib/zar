<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Şablon köməkçisi (OpenAI)
    |--------------------------------------------------------------------------
    | Admin paneldə «AI ilə hazırla» düyməsini işə salır. Açar YALNIZ `.env`
    | faylından oxunur və heç vaxt bazaya, kataloq ixracına və ya brauzerə
    | düşmür — Epoint açarları ilə eyni qayda.
    |
    | Model isə admin paneldən dəyişilir (`/admin/parametrler`), çünki OpenAI
    | model adları tez-tez yenilənir və bunun üçün deploy gözləmək lazım deyil.
    | Həll sırası: settings.ai_model → AI_MODEL → aşağıdakı default.
    */
    'enabled'  => env('AI_ENABLED', true),
    'key'      => env('OPENAI_API_KEY'),
    'endpoint' => env('OPENAI_ENDPOINT', 'https://api.openai.com/v1/chat/completions'),
    'model'    => env('AI_MODEL', 'gpt-5.4-mini'),
    'timeout'  => (int) env('AI_TIMEOUT', 90),

    // Panelin açılan siyahısı. İcazə siyahısı DEYİL — admin sahəyə istənilən
    // model adı yaza bilər, yoxlanan yalnız formatdır (`AiSettings::validModel`).
    // Yeni model çıxanda kodu dəyişmək lazım gəlməsin deyə belədir.
    'suggested' => [
        'gpt-5.4-mini',   // default — ucuz və yeni
        'gpt-5.4-nano',   // ən ucuzu
        'gpt-5.4',
        'gpt-5.5',        // ən keyfiyyətlisi, bahalıdır
        'gpt-5-mini',
        'gpt-4.1-mini',
    ],

    // Bir çağırışda gözlənilən ən böyük cavab. Variant siyahıları uzun olur.
    'max_output_tokens' => (int) env('AI_MAX_OUTPUT_TOKENS', 6000),

    // Bəzi yeni modellər `temperature` qəbul etmir; dəyər verilsə də, model
    // rədd etdikdə `OpenAiClient` parametri atıb yenidən cəhd edir.
    'temperature' => env('AI_TEMPERATURE') === null ? null : (float) env('AI_TEMPERATURE'),
];
