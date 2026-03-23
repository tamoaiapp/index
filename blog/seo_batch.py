#!/usr/bin/env python3
import os
import re

BLOG_DIR = r"C:\Users\Notebook\tamowork-site\blog"

FILES = [
"agente-de-ia-ahorra-tiempo-empresario.html",
"agente-de-ia-analise-conversas-melhora-negocio.html",
"agente-de-ia-analisis-conversaciones-negocio.html",
"agente-de-ia-atencion-whatsapp.html",
"agente-de-ia-atende-cliente-irritado-como.html",
"agente-de-ia-atendimento-fora-horario-comercial.html",
"agente-de-ia-atendimento-omnichannel-instagram-whatsapp.html",
"agente-de-ia-atiende-fuera-horario-comercial.html",
"agente-de-ia-aumenta-satisfaccion-cliente.html",
"agente-de-ia-aumenta-vendas-pequena-empresa.html",
"agente-de-ia-aumenta-ventas-negocio.html",
"agente-de-ia-comentarios-instagram.html",
"agente-de-ia-converte-seguidor-instagram-cliente-whatsapp.html",
"agente-de-ia-convierte-mas-ventas-instagram.html",
"agente-de-ia-convierte-seguidor-instagram-cliente-whatsapp.html",
"agente-de-ia-cuando-escalar-humano.html",
"agente-de-ia-economiza-tempo-pequeno-empresario.html",
"agente-de-ia-escala-negocio-sem-contratar.html",
"agente-de-ia-escala-negocio-sin-contratar.html",
"agente-de-ia-evita-perda-venda-fim-semana.html",
"agente-de-ia-evita-perdida-ventas-fines-semana.html",
"agente-de-ia-futuro-negocios-locales.html",
"agente-de-ia-gratuito-para-pequena-empresa-brasil.html",
"agente-de-ia-gratuito-pequeno-negocio.html",
"agente-de-ia-gratuito-vs-pago-qual-vale-mais.html",
"agente-de-ia-gratuito-vs-pago.html",
"agente-de-ia-horario-pico-instagram-whatsapp.html",
"agente-de-ia-horas-pico-instagram-whatsapp.html",
"agente-de-ia-instagram-algoritmo-engagement.html",
"agente-de-ia-instagram-algoritmo-engajamento.html",
"agente-de-ia-instagram-atacado-varejo.html",
"agente-de-ia-instagram-atencion-nocturna.html",
"agente-de-ia-instagram-atendimento-noturno.html",
"agente-de-ia-instagram-bio-link-automatico.html",
"agente-de-ia-instagram-black-friday-datas-especiais.html",
"agente-de-ia-instagram-black-friday-temporadas.html",
"agente-de-ia-instagram-calificar-leads.html",
"agente-de-ia-instagram-campana-lanzamiento.html",
"agente-de-ia-instagram-campanha-lancamento.html",
"agente-de-ia-instagram-captacion-leads.html",
"agente-de-ia-instagram-catalogo-productos.html",
"agente-de-ia-instagram-catalogo-produtos.html",
"agente-de-ia-instagram-coleta-leads.html",
"agente-de-ia-instagram-concursos-sorteios.html",
"agente-de-ia-instagram-concursos-sorteos.html",
"agente-de-ia-instagram-confirmacao-pedidos.html",
"agente-de-ia-instagram-confirmacion-pedidos.html",
"agente-de-ia-instagram-embudo-ventas.html",
"agente-de-ia-instagram-fidelizacao.html",
"agente-de-ia-instagram-fidelizacion.html",
"agente-de-ia-instagram-funil-de-vendas.html",
"agente-de-ia-instagram-gestao-reclamacoes.html",
"agente-de-ia-instagram-gestion-quejas.html",
"agente-de-ia-instagram-hashtag-monitoring.html",
"agente-de-ia-instagram-hashtags-comentarios.html",
"agente-de-ia-instagram-hashtags.html",
"agente-de-ia-instagram-influencer-collaboration.html",
"agente-de-ia-instagram-influencers-collab.html",
"agente-de-ia-instagram-influencers.html",
"agente-de-ia-instagram-link-bio-automatico.html",
"agente-de-ia-instagram-loja-virtual.html",
"agente-de-ia-instagram-loyalty-program.html",
"agente-de-ia-instagram-mayoreo-menudeo.html",
"agente-de-ia-instagram-mayoristas-b2b.html",
"agente-de-ia-instagram-mensajes-directos.html",
"agente-de-ia-instagram-meta-ads.html",
"agente-de-ia-instagram-multiplas-contas.html",
"agente-de-ia-instagram-overnight-service.html",
"agente-de-ia-instagram-pedidos-personalizados.html",
"agente-de-ia-instagram-pequenos-negocios-2026.html",
"agente-de-ia-instagram-perguntas-preco.html",
"agente-de-ia-instagram-pesquisa-satisfacao.html",
"agente-de-ia-instagram-post-purchase.html",
"agente-de-ia-instagram-pre-lancamento.html",
"agente-de-ia-instagram-prelanzamiento.html",
"agente-de-ia-instagram-produto-personalizado.html",
"agente-de-ia-instagram-qualificar-leads.html",
"agente-de-ia-instagram-reclamacoes-como-tratar.html",
"agente-de-ia-instagram-reels-comentarios.html",
"agente-de-ia-instagram-remarketing.html",
"agente-de-ia-instagram-resposta-comentario-produto.html",
"agente-de-ia-instagram-seguidores-clientes.html",
"agente-de-ia-instagram-sell-without-website.html",
"agente-de-ia-instagram-servico-pos-venda.html",
"agente-de-ia-instagram-servicio-posventa.html",
"agente-de-ia-instagram-shop.html",
"agente-de-ia-instagram-stories-reactions.html",
"agente-de-ia-instagram-stories-respostas.html",
"agente-de-ia-instagram-stories-sales.html",
"agente-de-ia-instagram-tienda-online.html",
"agente-de-ia-instagram-vender-mais-direct.html",
"agente-de-ia-instagram-vender-sem-site.html",
"agente-de-ia-instagram-vender-sin-web.html",
"agente-de-ia-instagram-vendas-stories.html",
"agente-de-ia-instagram-waitlist.html",
"agente-de-ia-instagram-wholesale.html",
"agente-de-ia-instagram-2026-trends.html",
"agente-de-ia-mlti-canal-instagram-whatsapp.html",
"agente-de-ia-multi-canal-instagram-whatsapp.html",
"agente-de-ia-multicanal.html",
"agente-de-ia-multichannel.html",
"agente-de-ia-para-academia-fitness.html",
"agente-de-ia-para-artesaos-criativos.html",
"agente-de-ia-para-clinica-de-estetica.html",
"agente-de-ia-para-clinica-medica.html",
"agente-de-ia-para-coach.html",
"agente-de-ia-para-comerciantes-ambulantes.html",
"agente-de-ia-para-confeitaria-brasil.html",
"agente-de-ia-para-ecommerce-brasil.html",
"agente-de-ia-para-escola-cursos-online.html",
"agente-de-ia-para-estudio-yoga.html",
"agente-de-ia-para-freelancers-autonomos.html",
"agente-de-ia-para-fotografia.html",
"agente-de-ia-para-gimnasio-fitness.html",
"agente-de-ia-para-imobiliaria.html",
"agente-de-ia-para-loja-de-roupas.html",
"agente-de-ia-para-manicurista.html",
"agente-de-ia-para-microempreendedores.html",
"agente-de-ia-para-pastelaria-reposteria.html",
"agente-de-ia-para-pastelderia.html",
"agente-de-ia-para-petshop.html",
"agente-de-ia-para-prestadores-de-servico.html",
"agente-de-ia-para-prestadores-servicios.html",
"agente-de-ia-para-restaurante.html",
"agente-de-ia-para-restaurante-brasil.html",
"agente-de-ia-para-salao-de-beleza.html",
"agente-de-ia-para-salon-belleza.html",
"agente-de-ia-para-tienda-online.html",
"agente-de-ia-para-tienda-ropa.html",
"agente-de-ia-para-veterinaria-petshop.html",
"agente-de-ia-pequena-empresa-compete-grande.html",
"agente-de-ia-tom-humanizado-atendimento.html",
"agente-de-ia-tom-humanizado.html",
"agente-de-ia-vs-automacao-tradicional.html",
"agente-de-ia-vs-automatizacion-tradicional.html",
"agente-de-ia-whatsapp-acompanhar-pedido.html",
"agente-de-ia-whatsapp-aniversario-clientes.html",
"agente-de-ia-whatsapp-boas-vindas-novos-clientes.html",
"agente-de-ia-whatsapp-bienvenida-nuevos-clientes.html",
"agente-de-ia-whatsapp-business-configuracao.html",
"agente-de-ia-whatsapp-business-setup.html",
"agente-de-ia-whatsapp-campanas-marketing.html",
"agente-de-ia-whatsapp-campanha-marketing.html",
"agente-de-ia-whatsapp-carrinho-abandonado.html",
]

# FAQ data per language and niche (keyed by filename fragment)
def get_faq_and_lang(filename, html_content):
    # detect language
    lang = "pt"
    if 'lang="es"' in html_content:
        lang = "es"
    elif 'lang="en"' in html_content:
        lang = "en"
    elif 'lang="pt' in html_content:
        lang = "pt"

    slug = filename.replace(".html", "")

    # Build niche-specific FAQs
    faqs = build_faqs(slug, lang)
    return lang, faqs


def build_faqs(slug, lang):
    # Default Q&A sets by language
    # Always: one about free, one about setup time, two niche-specific
    if lang == "pt":
        free_q = "O TamoWork é realmente gratuito?"
        free_a = "Sim, o TamoWork é 100% gratuito. Não há mensalidade, plano pago ou taxa de uso. Você baixa uma vez e usa para sempre no seu computador, sem assinar nada."
        setup_q = "Quanto tempo leva para configurar o TamoWork?"
        setup_a = "Em menos de 30 minutos você já tem o agente de IA funcionando e respondendo clientes automaticamente no Instagram e no WhatsApp."
    elif lang == "es":
        free_q = "¿TamoWork es realmente gratuito?"
        free_a = "Sí, TamoWork es 100% gratuito. No hay suscripción mensual, plan de pago ni tarifa de uso. Lo descargas una vez y lo usas para siempre en tu computadora, sin contratos."
        setup_q = "¿Cuánto tiempo tarda configurar TamoWork?"
        setup_a = "En menos de 30 minutos ya tienes el agente de IA funcionando y respondiendo clientes automáticamente en Instagram y WhatsApp."
    else:  # en
        free_q = "Is TamoWork really free?"
        free_a = "Yes, TamoWork is 100% free. No monthly subscription, no paid plan, no usage fees. Download once and use it forever on your computer, no contracts."
        setup_q = "How long does it take to set up TamoWork?"
        setup_a = "In less than 30 minutes you have the AI agent running and automatically replying to customers on Instagram and WhatsApp."

    # Niche-specific overrides
    niche_faqs = get_niche_faqs(slug, lang)

    return [
        (free_q, free_a),
        (setup_q, setup_a),
        niche_faqs[0],
        niche_faqs[1],
    ]


def get_niche_faqs(slug, lang):
    # Map slug fragments to niche Q&As
    s = slug.lower()

    if "academia" in s or "fitness" in s or "gimnasio" in s:
        if lang == "pt":
            return [
                ("O agente de IA consegue responder dúvidas sobre planos de treino?", "Sim. Você configura o agente com informações sobre os planos, horários e preços da academia. Ele responde automaticamente perguntas frequentes de alunos e prospects no Instagram e WhatsApp."),
                ("O agente pode enviar lembretes de renovação de matrícula?", "Sim. O TamoWork pode ser configurado para enviar mensagens proativas de lembrete para alunos com matrícula próxima do vencimento via WhatsApp."),
            ]
        elif lang == "es":
            return [
                ("¿El agente de IA puede responder dudas sobre planes de entrenamiento?", "Sí. Configuras el agente con información sobre los planes, horarios y precios del gimnasio. Responde automáticamente las preguntas frecuentes de alumnos y prospectos en Instagram y WhatsApp."),
                ("¿El agente puede enviar recordatorios de renovación de membresía?", "Sí. TamoWork puede configurarse para enviar mensajes proactivos de recordatorio a socios con membresía próxima a vencer por WhatsApp."),
            ]
        else:
            return [
                ("Can the AI agent answer questions about training plans?", "Yes. You configure the agent with information about plans, schedules and gym pricing. It automatically answers frequent questions from students and prospects on Instagram and WhatsApp."),
                ("Can the agent send membership renewal reminders?", "Yes. TamoWork can be configured to proactively send reminder messages to members whose membership is about to expire via WhatsApp."),
            ]

    elif "salao" in s or "beleza" in s or "salon" in s or "belleza" in s or "manicur" in s:
        if lang == "pt":
            return [
                ("O agente consegue fazer agendamento de horários automaticamente?", "Sim. O agente de IA do TamoWork responde perguntas sobre disponibilidade, preços e serviços, e pode direcionar o cliente para confirmar o agendamento diretamente pelo WhatsApp."),
                ("Como o agente lida com cancelamentos de última hora?", "O agente identifica mensagens de cancelamento e responde com políticas do salão, oferece reagendamento e mantém o histórico para que você possa acompanhar."),
            ]
        elif lang == "es":
            return [
                ("¿El agente puede gestionar reservas de citas automáticamente?", "Sí. El agente de IA de TamoWork responde preguntas sobre disponibilidad, precios y servicios, y puede dirigir al cliente a confirmar la cita directamente por WhatsApp."),
                ("¿Cómo maneja el agente las cancelaciones de último minuto?", "El agente identifica mensajes de cancelación y responde con las políticas del salón, ofrece reagendar y mantiene el historial para que puedas hacer seguimiento."),
            ]
        else:
            return [
                ("Can the agent automatically manage appointment bookings?", "Yes. TamoWork's AI agent answers questions about availability, prices and services, and can direct clients to confirm appointments directly via WhatsApp."),
                ("How does the agent handle last-minute cancellations?", "The agent identifies cancellation messages, responds with salon policies, offers rescheduling options and keeps a record so you can follow up."),
            ]

    elif "restaurante" in s:
        if lang == "pt":
            return [
                ("O agente de IA consegue responder perguntas sobre o cardápio?", "Sim. Você configura o TamoWork com o cardápio completo e ele responde automaticamente perguntas sobre pratos, ingredientes, preços e opções especiais direto no Instagram e WhatsApp."),
                ("O agente consegue receber pedidos de delivery pelo WhatsApp?", "Sim. O agente coleta as informações do pedido, endereço e preferências do cliente, e organiza tudo para que você confirme e prepare o delivery sem precisar ficar digitando."),
            ]
        elif lang == "es":
            return [
                ("¿El agente de IA puede responder preguntas sobre el menú?", "Sí. Configuras TamoWork con el menú completo y responde automáticamente preguntas sobre platos, ingredientes, precios y opciones especiales en Instagram y WhatsApp."),
                ("¿El agente puede recibir pedidos de delivery por WhatsApp?", "Sí. El agente recopila la información del pedido, dirección y preferencias del cliente, y lo organiza todo para que confirmes y prepares el delivery sin tener que escribir."),
            ]
        else:
            return [
                ("Can the AI agent answer questions about the menu?", "Yes. You configure TamoWork with the full menu and it automatically answers questions about dishes, ingredients, prices and specials on Instagram and WhatsApp."),
                ("Can the agent receive delivery orders via WhatsApp?", "Yes. The agent collects order information, address and customer preferences, organizing everything so you can confirm and prepare delivery without manual typing."),
            ]

    elif "confeit" in s or "pastel" in s or "repost" in s or "pasteld" in s:
        if lang == "pt":
            return [
                ("O agente consegue responder pedidos de bolos personalizados?", "Sim. Você configura o TamoWork com as opções de sabores, tamanhos e preços. O agente coleta os detalhes do pedido personalizado via Instagram ou WhatsApp e passa para você confirmar."),
                ("Como funciona o agente em datas comemorativas com alto volume de pedidos?", "O agente fica ativo 24h por dia, respondendo todos os pedidos mesmo nos períodos de pico como Páscoa, Natal e Dia das Mães. Você não perde nenhum cliente por demora no atendimento."),
            ]
        elif lang == "es":
            return [
                ("¿El agente puede responder pedidos de tortas personalizadas?", "Sí. Configuras TamoWork con las opciones de sabores, tamaños y precios. El agente recopila los detalles del pedido personalizado por Instagram o WhatsApp y te lo pasa para confirmar."),
                ("¿Cómo funciona el agente en fechas especiales con alto volumen de pedidos?", "El agente está activo 24h al día, respondiendo todos los pedidos incluso en temporadas altas como Navidad, Día de las Madres y San Valentín. No pierdes clientes por demora en la atención."),
            ]
        else:
            return [
                ("Can the agent handle custom cake orders?", "Yes. You configure TamoWork with flavor options, sizes and prices. The agent collects custom order details via Instagram or WhatsApp and passes them to you to confirm."),
                ("How does the agent work during peak seasons with high order volumes?", "The agent is active 24h a day, responding to all orders even during peak periods like Christmas and Valentine's Day. You never lose customers due to slow responses."),
            ]

    elif "petshop" in s or "veterinaria" in s or "veterinar" in s:
        if lang == "pt":
            return [
                ("O agente de IA consegue responder sobre serviços de banho e tosa?", "Sim. Você configura o TamoWork com os serviços, preços por porte de animal e horários disponíveis. O agente responde automaticamente e agenda via WhatsApp ou Instagram DM."),
                ("O agente pode lembrar os clientes sobre vacinas e consultas?", "Sim. O TamoWork pode ser configurado para enviar lembretes proativos de vacinação e consultas periódicas para os tutores dos pets pelo WhatsApp."),
            ]
        elif lang == "es":
            return [
                ("¿El agente de IA puede responder sobre servicios de baño y corte?", "Sí. Configuras TamoWork con los servicios, precios según tamaño del animal y horarios disponibles. El agente responde automáticamente y agenda por WhatsApp o Instagram DM."),
                ("¿El agente puede recordar a los clientes sobre vacunas y consultas?", "Sí. TamoWork puede configurarse para enviar recordatorios proactivos de vacunación y consultas periódicas a los dueños de mascotas por WhatsApp."),
            ]
        else:
            return [
                ("Can the AI agent answer questions about grooming services?", "Yes. You configure TamoWork with services, pricing by pet size and available times. The agent automatically responds and schedules via WhatsApp or Instagram DM."),
                ("Can the agent remind clients about vaccines and checkups?", "Yes. TamoWork can be configured to proactively send vaccination and periodic checkup reminders to pet owners via WhatsApp."),
            ]

    elif "clinica" in s or "medica" in s or "estetica" in s or "estetica" in s:
        if lang == "pt":
            return [
                ("O agente de IA pode fazer triagem de consultas médicas/estéticas?", "Sim. O TamoWork responde perguntas frequentes sobre procedimentos, valores e disponibilidade de agenda, facilitando a triagem inicial sem sobrecarregar a recepção."),
                ("Como o agente mantém a privacidade dos pacientes?", "O TamoWork roda localmente no seu computador. Nenhum dado de paciente é enviado para servidores externos, garantindo conformidade com a LGPD e a privacidade dos seus clientes."),
            ]
        elif lang == "es":
            return [
                ("¿El agente de IA puede hacer triaje de consultas médicas/estéticas?", "Sí. TamoWork responde preguntas frecuentes sobre procedimientos, valores y disponibilidad de agenda, facilitando el triaje inicial sin sobrecargar la recepción."),
                ("¿Cómo mantiene el agente la privacidad de los pacientes?", "TamoWork funciona localmente en tu computadora. Ningún dato de paciente se envía a servidores externos, garantizando privacidad y cumplimiento normativo."),
            ]
        else:
            return [
                ("Can the AI agent triage medical/aesthetic appointment inquiries?", "Yes. TamoWork answers common questions about procedures, pricing and availability, easing initial triage without overwhelming reception staff."),
                ("How does the agent protect patient privacy?", "TamoWork runs locally on your computer. No patient data is sent to external servers, ensuring privacy compliance and keeping your clients' information secure."),
            ]

    elif "imobiliaria" in s or "imobi" in s:
        if lang == "pt":
            return [
                ("O agente consegue responder sobre imóveis disponíveis no Instagram?", "Sim. Você configura o TamoWork com o portfólio de imóveis e ele responde automaticamente perguntas sobre preços, localização, metragem e disponibilidade direto no Instagram DM."),
                ("Como o agente qualifica leads de compradores e locatários?", "O agente faz perguntas de qualificação no chat (faixa de preço, número de quartos, região desejada) e organiza essas informações para que você saiba quais leads têm mais potencial."),
            ]
        else:
            return [
                ("¿El agente puede responder sobre propiedades disponibles en Instagram?", "Sí. Configuras TamoWork con el portafolio de propiedades y responde automáticamente preguntas sobre precios, ubicación, metros cuadrados y disponibilidad en Instagram DM."),
                ("¿Cómo califica el agente a los leads de compradores e inquilinos?", "El agente hace preguntas de calificación en el chat (rango de precio, número de habitaciones, zona deseada) y organiza esa información para que sepas qué leads tienen más potencial."),
            ]

    elif "loja" in s and "roupa" in s or "tienda" in s and "ropa" in s:
        if lang == "pt":
            return [
                ("O agente consegue responder sobre grades de tamanhos e estoque?", "Sim. Você configura o TamoWork com as grades de tamanhos disponíveis por produto. O agente responde automaticamente perguntas de tamanho, cor e disponibilidade no Instagram e WhatsApp."),
                ("Como funciona o agente para atendimento de trocas e devoluções?", "O agente responde as perguntas iniciais sobre política de troca, prazo e procedimento. Para casos específicos, ele direciona o cliente para atendimento personalizado, economizando seu tempo."),
            ]
        elif lang == "es":
            return [
                ("¿El agente puede responder sobre tallas disponibles y stock?", "Sí. Configuras TamoWork con las tallas disponibles por producto. El agente responde automáticamente preguntas de talla, color y disponibilidad en Instagram y WhatsApp."),
                ("¿Cómo funciona el agente para cambios y devoluciones?", "El agente responde las preguntas iniciales sobre política de cambio, plazo y procedimiento. Para casos específicos, dirige al cliente a atención personalizada, ahorrando tu tiempo."),
            ]
        else:
            return [
                ("Can the agent answer questions about sizing and stock?", "Yes. You configure TamoWork with available sizes per product. The agent automatically answers questions about sizing, color and availability on Instagram and WhatsApp."),
                ("How does the agent handle exchanges and returns?", "The agent answers initial questions about exchange policy, timeframes and procedures. For specific cases it directs the customer to personalized service, saving your time."),
            ]

    elif "whatsapp" in s and "carrinho" in s or "whatsapp" in s and "abandonado" in s:
        if lang == "pt":
            return [
                ("O agente consegue identificar clientes que abandonaram o carrinho?", "Sim. O TamoWork pode ser configurado para enviar mensagens de recuperação para clientes que iniciaram uma conversa de compra mas não finalizaram, aumentando suas conversões."),
                ("Quantas mensagens de recuperação o agente pode enviar por dia?", "Não há limite fixo. O agente opera continuamente e pode acompanhar múltiplos clientes simultaneamente, enviando follow-ups de carrinho abandonado sem custo adicional."),
            ]
        elif lang == "es":
            return [
                ("¿El agente puede identificar clientes que abandonaron el carrito?", "Sí. TamoWork puede configurarse para enviar mensajes de recuperación a clientes que iniciaron una conversación de compra pero no la completaron, aumentando tus conversiones."),
                ("¿Cuántos mensajes de recuperación puede enviar el agente por día?", "No hay límite fijo. El agente opera continuamente y puede gestionar múltiples clientes simultáneamente, enviando follow-ups de carrito abandonado sin costo adicional."),
            ]
        else:
            return [
                ("Can the agent identify customers who abandoned their cart?", "Yes. TamoWork can be configured to send recovery messages to customers who started a purchase conversation but did not complete it, increasing your conversions."),
                ("How many recovery messages can the agent send per day?", "There is no fixed limit. The agent operates continuously and can handle multiple customers simultaneously, sending abandoned cart follow-ups at no extra cost."),
            ]

    elif "coach" in s:
        if lang == "pt":
            return [
                ("O agente consegue responder dúvidas sobre programas de coaching?", "Sim. Configure o TamoWork com detalhes dos seus programas, preços e metodologia. O agente responde automaticamente perguntas de prospects no Instagram e WhatsApp, pré-qualificando leads."),
                ("Como o agente mantém o tom profissional de um coach?", "Você define a personalidade e o tom do agente nas configurações do TamoWork. Ele vai responder de forma coerente com a sua marca pessoal, sem soar como um robô genérico."),
            ]
        elif lang == "es":
            return [
                ("¿El agente puede responder dudas sobre programas de coaching?", "Sí. Configura TamoWork con detalles de tus programas, precios y metodología. El agente responde automáticamente preguntas de prospectos en Instagram y WhatsApp, precalificando leads."),
                ("¿Cómo mantiene el agente el tono profesional de un coach?", "Tú defines la personalidad y el tono del agente en la configuración de TamoWork. Responderá de forma coherente con tu marca personal, sin sonar como un robot genérico."),
            ]
        else:
            return [
                ("Can the agent answer questions about coaching programs?", "Yes. Configure TamoWork with your program details, pricing and methodology. The agent automatically answers prospect questions on Instagram and WhatsApp, pre-qualifying leads."),
                ("How does the agent maintain a professional coaching tone?", "You define the agent's personality and tone in TamoWork settings. It responds consistently with your personal brand, without sounding like a generic bot."),
            ]

    elif "escola" in s or "curso" in s or "online" in s:
        if lang == "pt":
            return [
                ("O agente de IA consegue responder sobre conteúdo dos cursos?", "Sim. Configure o TamoWork com a ementa e descrição dos cursos. O agente responde dúvidas de alunos e prospects sobre módulos, carga horária, certificado e formas de pagamento."),
                ("O agente pode fazer matrículas pelo WhatsApp?", "Sim. O agente coleta os dados do aluno interessado e direciona para o link de pagamento ou formulário de matrícula, facilitando a conversão sem você precisar responder cada lead manualmente."),
            ]
        elif lang == "es":
            return [
                ("¿El agente de IA puede responder sobre el contenido de los cursos?", "Sí. Configura TamoWork con el programa y descripción de los cursos. El agente responde dudas de alumnos y prospectos sobre módulos, duración, certificado y formas de pago."),
                ("¿El agente puede gestionar inscripciones por WhatsApp?", "Sí. El agente recopila los datos del alumno interesado y lo dirige al enlace de pago o formulario de inscripción, facilitando la conversión sin que tengas que responder cada lead manualmente."),
            ]
        else:
            return [
                ("Can the AI agent answer questions about course content?", "Yes. Configure TamoWork with the course syllabus and description. The agent answers questions from students and prospects about modules, duration, certificates and payment options."),
                ("Can the agent handle course enrollments via WhatsApp?", "Yes. The agent collects interested student data and directs them to the payment link or enrollment form, facilitating conversions without you manually responding to every lead."),
            ]

    elif "fotografia" in s or "fotografo" in s or "fotografía" in s:
        if lang == "pt":
            return [
                ("O agente consegue responder sobre pacotes de fotografia e preços?", "Sim. Configure o TamoWork com seus pacotes, preços e disponibilidade de agenda. O agente responde automaticamente prospects no Instagram DM e WhatsApp, liberando você para focar nos ensaios."),
                ("Como o agente lida com pedidos de orçamento personalizado?", "O agente coleta as informações do evento (data, local, tipo de ensaio) e as passa para você montar o orçamento personalizado, economizando tempo em conversas iniciais."),
            ]
        elif lang == "es":
            return [
                ("¿El agente puede responder sobre paquetes de fotografía y precios?", "Sí. Configura TamoWork con tus paquetes, precios y disponibilidad de agenda. El agente responde automáticamente a prospectos en Instagram DM y WhatsApp, liberándote para enfocarte en las sesiones."),
                ("¿Cómo maneja el agente las solicitudes de presupuesto personalizado?", "El agente recopila la información del evento (fecha, lugar, tipo de sesión) y te la pasa para armar el presupuesto personalizado, ahorrando tiempo en conversaciones iniciales."),
            ]
        else:
            return [
                ("Can the agent answer questions about photography packages and pricing?", "Yes. Configure TamoWork with your packages, prices and schedule availability. The agent automatically responds to prospects on Instagram DM and WhatsApp, freeing you to focus on shoots."),
                ("How does the agent handle custom quote requests?", "The agent collects event information (date, location, session type) and passes it to you to build the custom quote, saving time on initial conversations."),
            ]

    elif "freelancer" in s or "autonomo" in s or "prestador" in s:
        if lang == "pt":
            return [
                ("O agente de IA pode responder consultas de orçamento para freelancers?", "Sim. Configure o TamoWork com os tipos de serviço que você oferece e faixas de preço. O agente responde automaticamente pedidos de orçamento no Instagram e WhatsApp, qualificando os leads."),
                ("Como o agente ajuda freelancers a gerenciar múltiplos clientes simultaneamente?", "O TamoWork responde todos os clientes em paralelo, 24h por dia. Você recebe apenas as conversas que precisam da sua atenção, sem deixar ninguém sem resposta."),
            ]
        elif lang == "es":
            return [
                ("¿El agente de IA puede responder consultas de presupuesto para freelancers?", "Sí. Configura TamoWork con los tipos de servicio que ofreces y rangos de precio. El agente responde automáticamente solicitudes de presupuesto en Instagram y WhatsApp, calificando los leads."),
                ("¿Cómo ayuda el agente a los freelancers a gestionar múltiples clientes simultáneamente?", "TamoWork responde a todos los clientes en paralelo, 24h al día. Solo recibes las conversaciones que necesitan tu atención, sin dejar a nadie sin respuesta."),
            ]
        else:
            return [
                ("Can the AI agent respond to quote inquiries for freelancers?", "Yes. Configure TamoWork with the service types you offer and price ranges. The agent automatically responds to quote requests on Instagram and WhatsApp, qualifying leads."),
                ("How does the agent help freelancers manage multiple clients simultaneously?", "TamoWork responds to all clients in parallel, 24h a day. You only receive conversations that need your attention, without leaving anyone unanswered."),
            ]

    elif "artesa" in s or "criativo" in s or "criativos" in s:
        if lang == "pt":
            return [
                ("O agente consegue mostrar o catálogo de produtos artesanais no Instagram?", "Sim. Configure o TamoWork com descrições e preços das suas peças. O agente responde automaticamente perguntas sobre disponibilidade, materiais e prazos de entrega no DM do Instagram."),
                ("Como o agente lida com pedidos personalizados de artesanato?", "O agente coleta os detalhes do pedido personalizado (cores, tamanho, referência) e passa para você aprovar antes de confirmar. Tudo documentado no histórico de conversas."),
            ]
        else:
            return [
                ("¿El agente puede mostrar el catálogo de productos artesanales en Instagram?", "Sí. Configura TamoWork con descripciones y precios de tus piezas. El agente responde automáticamente preguntas sobre disponibilidad, materiales y plazos de entrega en el DM de Instagram."),
                ("¿Cómo maneja el agente los pedidos personalizados de artesanía?", "El agente recopila los detalles del pedido personalizado (colores, tamaño, referencia) y te los pasa para aprobar antes de confirmar. Todo documentado en el historial de conversaciones."),
            ]

    elif "microempreendedor" in s or "micro" in s or "comerciante" in s:
        if lang == "pt":
            return [
                ("Microempreendedores precisam de conhecimento técnico para usar o TamoWork?", "Não. O TamoWork foi desenvolvido para quem não tem conhecimento técnico. A instalação é simples e o agente já vem pré-configurado para responder clientes desde o primeiro dia."),
                ("O TamoWork funciona para quem vende pelo Instagram e WhatsApp ao mesmo tempo?", "Sim. O TamoWork monitora Instagram (comentários e DMs) e WhatsApp simultaneamente, respondendo em todos os canais ao mesmo tempo sem você precisar fazer nada."),
            ]
        elif lang == "es":
            return [
                ("¿Los microempresarios necesitan conocimientos técnicos para usar TamoWork?", "No. TamoWork fue desarrollado para quienes no tienen conocimientos técnicos. La instalación es simple y el agente ya viene preconfigurado para responder clientes desde el primer día."),
                ("¿TamoWork funciona para quienes venden por Instagram y WhatsApp al mismo tiempo?", "Sí. TamoWork monitorea Instagram (comentarios y DMs) y WhatsApp simultáneamente, respondiendo en todos los canales al mismo tiempo sin que tengas que hacer nada."),
            ]
        else:
            return [
                ("Do micro-entrepreneurs need technical knowledge to use TamoWork?", "No. TamoWork was built for people without technical expertise. Installation is simple and the agent comes pre-configured to respond to customers from day one."),
                ("Does TamoWork work for those selling on Instagram and WhatsApp at the same time?", "Yes. TamoWork monitors Instagram (comments and DMs) and WhatsApp simultaneously, responding on all channels at the same time without you needing to do anything."),
            ]

    elif "yoga" in s or "estudio" in s:
        if lang == "pt":
            return [
                ("O agente consegue responder sobre horários de aulas de yoga?", "Sim. Configure o TamoWork com a grade de horários, tipos de aula e preços. O agente responde automaticamente perguntas de alunos e prospects no Instagram e WhatsApp."),
                ("Como o agente lida com reservas de vagas em aulas?", "O agente informa disponibilidade de vagas e direciona o aluno para confirmar a reserva via link ou WhatsApp, sem você precisar monitorar as mensagens constantemente."),
            ]
        else:
            return [
                ("¿El agente puede responder sobre horarios de clases de yoga?", "Sí. Configura TamoWork con el horario de clases, tipos de práctica y precios. El agente responde automáticamente preguntas de alumnos y prospectos en Instagram y WhatsApp."),
                ("¿Cómo maneja el agente las reservas de plazas en clases?", "El agente informa disponibilidad de plazas y dirige al alumno a confirmar la reserva por enlace o WhatsApp, sin que tengas que monitorar los mensajes constantemente."),
            ]

    # Defaults for all other slugs
    if lang == "pt":
        return [
            ("O TamoWork funciona em qualquer computador Windows?", "Sim. O TamoWork roda em qualquer computador Windows com 4GB de RAM ou mais. Não precisa de placa de vídeo especial nem de internet contínua para a IA funcionar."),
            ("O agente de IA do TamoWork responde em português natural?", "Sim. O TamoWork usa um modelo de linguagem treinado em português. As respostas saem naturais, sem parecer tradução ou texto robótico."),
        ]
    elif lang == "es":
        return [
            ("¿TamoWork funciona en cualquier computadora Windows?", "Sí. TamoWork corre en cualquier computadora Windows con 4GB de RAM o más. No necesitas tarjeta gráfica especial ni internet continua para que la IA funcione."),
            ("¿El agente de IA de TamoWork responde en español natural?", "Sí. TamoWork usa un modelo de lenguaje entrenado en español. Las respuestas salen naturales, sin parecer traducción ni texto robótico."),
        ]
    else:
        return [
            ("Does TamoWork work on any Windows computer?", "Yes. TamoWork runs on any Windows computer with 4GB of RAM or more. No special graphics card or continuous internet connection needed for the AI to work."),
            ("Does TamoWork's AI agent respond in natural language?", "Yes. TamoWork uses a language model that produces natural, conversational responses — not robotic or template-sounding text."),
        ]


def build_faq_html(lang, faqs):
    if lang == "pt":
        heading = "Perguntas Frequentes"
    elif lang == "es":
        heading = "Preguntas Frecuentes"
    else:
        heading = "Frequently Asked Questions"

    items = ""
    for q, a in faqs:
        items += f"""
    <div><h3 style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:8px">{q}</h3><p style="font-size:15px;color:var(--muted);line-height:1.7;margin:0">{a}</p></div>"""

    return f"""<div style="background:var(--card);border:1px solid var(--line);border-radius:18px;padding:32px;margin-top:48px">
  <h2 style="font-size:20px;font-weight:800;margin-bottom:24px;color:var(--text)">{heading}</h2>
  <div style="display:flex;flex-direction:column;gap:20px">{items}
  </div>
</div>
"""


def build_faq_jsonld(faqs):
    entities = []
    for q, a in faqs:
        q_esc = q.replace('"', '\\"')
        a_esc = a.replace('"', '\\"')
        entities.append(f'    {{"@type":"Question","name":"{q_esc}","acceptedAnswer":{{"@type":"Answer","text":"{a_esc}"}}}}')
    entities_str = ",\n".join(entities)
    return f"""<script type="application/ld+json">
{{
  "@context":"https://schema.org",
  "@type":"FAQPage",
  "mainEntity":[
{entities_str}
  ]
}}
</script>
"""


def build_comparison_block(lang):
    if lang == "pt":
        return """<div style="background:var(--card);border:1px solid var(--brand-border);border-radius:18px;padding:28px;margin:32px 0">
  <h3 style="font-size:17px;font-weight:800;color:var(--text);margin-bottom:16px">TamoWork vs ferramentas pagas: a diferença que importa</h3>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px"><p style="font-size:13px;font-weight:700;color:#ef4444;margin-bottom:8px">❌ Ferramentas SaaS</p><ul style="list-style:none;padding:0;margin:0;font-size:13px;color:var(--muted);display:flex;flex-direction:column;gap:6px"><li>R$ 200–500/mês de mensalidade</li><li>Dados na nuvem de terceiros</li><li>Depende de API e internet</li><li>Configuração complexa</li></ul></div>
    <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px"><p style="font-size:13px;font-weight:700;color:#16c784;margin-bottom:8px">✅ TamoWork</p><ul style="list-style:none;padding:0;margin:0;font-size:13px;color:var(--muted);display:flex;flex-direction:column;gap:6px"><li>100% gratuito, sem mensalidade</li><li>Roda no seu computador</li><li>IA local, sem API externa</li><li>Pronto em 30 minutos</li></ul></div>
  </div>
</div>
"""
    elif lang == "es":
        return """<div style="background:var(--card);border:1px solid var(--brand-border);border-radius:18px;padding:28px;margin:32px 0">
  <h3 style="font-size:17px;font-weight:800;color:var(--text);margin-bottom:16px">TamoWork vs herramientas de pago: la diferencia que importa</h3>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px"><p style="font-size:13px;font-weight:700;color:#ef4444;margin-bottom:8px">❌ Herramientas SaaS</p><ul style="list-style:none;padding:0;margin:0;font-size:13px;color:var(--muted);display:flex;flex-direction:column;gap:6px"><li>$30–100/mes de suscripción</li><li>Tus datos en servidores externos</li><li>Requiere API e internet</li><li>Configuración compleja</li></ul></div>
    <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px"><p style="font-size:13px;font-weight:700;color:#16c784;margin-bottom:8px">✅ TamoWork</p><ul style="list-style:none;padding:0;margin:0;font-size:13px;color:var(--muted);display:flex;flex-direction:column;gap:6px"><li>100% gratuito, sin suscripción</li><li>Corre en tu computadora</li><li>IA local, sin API externa</li><li>Listo en 30 minutos</li></ul></div>
  </div>
</div>
"""
    else:
        return """<div style="background:var(--card);border:1px solid var(--brand-border);border-radius:18px;padding:28px;margin:32px 0">
  <h3 style="font-size:17px;font-weight:800;color:var(--text);margin-bottom:16px">TamoWork vs paid tools: the difference that matters</h3>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px"><p style="font-size:13px;font-weight:700;color:#ef4444;margin-bottom:8px">❌ SaaS tools</p><ul style="list-style:none;padding:0;margin:0;font-size:13px;color:var(--muted);display:flex;flex-direction:column;gap:6px"><li>$30–100/month subscription</li><li>Your data on third-party servers</li><li>Requires API + internet</li><li>Complex setup</li></ul></div>
    <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px"><p style="font-size:13px;font-weight:700;color:#16c784;margin-bottom:8px">✅ TamoWork</p><ul style="list-style:none;padding:0;margin:0;font-size:13px;color:var(--muted);display:flex;flex-direction:column;gap:6px"><li>100% free, no subscription</li><li>Runs on your computer</li><li>Local AI, no external API</li><li>Ready in 30 minutes</li></ul></div>
  </div>
</div>
"""


def process_file(filepath, filename):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    # Skip if already processed (has FAQPage schema)
    if '"@type":"FAQPage"' in html or '"@type": "FAQPage"' in html:
        print(f"  SKIP (already has FAQPage): {filename}")
        return False

    lang, faqs = get_faq_and_lang(filename, html)

    faq_html = build_faq_html(lang, faqs)
    faq_jsonld = build_faq_jsonld(faqs)
    comparison = build_comparison_block(lang)

    # 1. Insert FAQPage JSON-LD before </head>
    if "</head>" in html:
        html = html.replace("</head>", faq_jsonld + "</head>", 1)

    # 2. Insert comparison block after first </p> that follows first </h2> in content area
    # Find content-wrap area start
    content_start = html.find('class="content-wrap"')
    if content_start == -1:
        content_start = html.find('content-wrap')
    if content_start != -1:
        # Find first </h2> after content_start
        h2_end = html.find("</h2>", content_start)
        if h2_end != -1:
            # Find first </p> after that </h2>
            p_end = html.find("</p>", h2_end)
            if p_end != -1:
                insert_pos = p_end + 4  # after </p>
                # Only insert if comparison not already present
                if "TamoWork vs" not in html[content_start:content_start+5000]:
                    html = html[:insert_pos] + "\n" + comparison + html[insert_pos:]

    # 3. Insert FAQ block before <div class="cta-box">
    if '<div class="cta-box">' in html:
        if "Perguntas Frequentes" not in html and "Preguntas Frecuentes" not in html and "Frequently Asked Questions" not in html:
            html = html.replace('<div class="cta-box">', faq_html + '<div class="cta-box">', 1)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)

    return True


processed = 0
skipped = 0
errors = []

for fname in FILES:
    fpath = os.path.join(BLOG_DIR, fname)
    if not os.path.exists(fpath):
        print(f"  NOT FOUND: {fname}")
        errors.append(fname)
        continue
    try:
        result = process_file(fpath, fname)
        if result:
            processed += 1
            print(f"  OK: {fname}")
        else:
            skipped += 1
    except Exception as e:
        print(f"  ERROR {fname}: {e}")
        errors.append(fname)

print(f"\nDone. Processed: {processed}, Skipped: {skipped}, Errors: {len(errors)}")
if errors:
    print("Errors:", errors)
