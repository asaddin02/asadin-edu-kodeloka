/* Video tab shared by the courses that embed YouTube.
   Every id below was checked against YouTube (title and channel come from its oEmbed data), and each
   module only points at a video that really covers its topic. A module without one says so instead of
   showing an unrelated video. Embeds use youtube-nocookie.com so no tracking cookie is set until play. */
(() => {
  'use strict';
  const VIDEOS = {
    // freeCodeCamp.org
    rjjES5IsPdg: ['Learn Docker – Full DevOps Course for Deploying Containerized Apps', 'freeCodeCamp.org'],
    // Corey Schafer
    '7AMjmCTumuo': ['Python FastAPI Tutorial (Part 1): Getting Started - Web App + REST API', 'Corey Schafer'],
    G4NIB9Rx9Qs: ['Python FastAPI Tutorial (Part 2): HTML Frontend for Your API - Jinja2 Templates', 'Corey Schafer'],
    WRjXIA5pMtk: ['Python FastAPI Tutorial (Part 3): Path Parameters - Validation and Error Handling', 'Corey Schafer'],
    '9GHxnttXxrA': ['Python FastAPI Tutorial (Part 4): Pydantic Schemas - Request and Response Validation', 'Corey Schafer'],
    NvOV3ig2tGY: ['Python FastAPI Tutorial (Part 5): Adding a Database - SQLAlchemy Models and Relationships', 'Corey Schafer'],
    VyoGAoxQhxM: ['Python FastAPI Tutorial (Part 6): Completing CRUD - Update and Delete (PUT, PATCH, DELETE)', 'Corey Schafer'],
    NkgIHa6KtHg: ['Python FastAPI Tutorial (Part 8): Routers - Organizing Routes into Modules with APIRouter', 'Corey Schafer'],
    Go4wYJJhR3k: ['Python FastAPI Tutorial (Part 10): Authentication - Registration and Login with JWT', 'Corey Schafer'],
    MY0TFMMm9B0: ['Python FastAPI Tutorial (Part 11): Authorization - Protecting Routes and Verifying Current User', 'Corey Schafer'],
    AExumWjfbyo: ['Python FastAPI Tutorial (Part 12): File Uploads - Image Processing, Validation, and Storage', 'Corey Schafer'],
    f1zggIOxmJg: ['Python FastAPI Tutorial (Part 13): Pagination - Loading More Data with Query Parameters', 'Corey Schafer'],
    '4HxjBvZMAg8': ['Python FastAPI Tutorial (Part 14): Password Reset - Email, Tokens, and Background Tasks', 'Corey Schafer'],
    e8NnDz8uT7o: ['Python FastAPI Tutorial (Part 15): PostgreSQL and Alembic - Database Migrations for Production', 'Corey Schafer'],
    zCTJ3AdDym4: ['Python FastAPI Tutorial (Part 16): AWS S3 and Boto3 - Moving File Uploads to the Cloud', 'Corey Schafer'],
    SO7m7nod0ts: ['Python FastAPI Tutorial (Part 17): Testing the API - Pytest, Fixtures, and Mocking External Services', 'Corey Schafer'],
    eqjngvKfabg: ['Python FastAPI Tutorial (Part 19): Deploy with Docker - Serverless Containers and Custom Domain', 'Corey Schafer'],
    // JavaScript Mastery
    I1V9YWqRIeI: ['Next.js 16 Full Course | Build and Deploy a Production-Ready Full Stack App', 'JavaScript Mastery'],
    // Programming with Mosh, TechWorld with Nana
    '8JJ101D3knE': ['Git Tutorial for Beginners: Learn Git in 1 Hour', 'Programming with Mosh'],
    AknbizcLq4w: ['CI/CD Explained: The DevOps Skill That Makes You 10x More Valuable', 'TechWorld with Nana'],
    MIWH2CpVyXs: ['The ONLY Continuous Integration (CI) Tutorial you need as an Engineer', 'TechWorld with Nana'],
    R8_veQiYBjI: ['GitHub Actions Tutorial - Basic Concepts and CI/CD Pipeline with Docker', 'TechWorld with Nana'],
    qP8kir2GUgo: ['GitLab CI CD Tutorial for Beginners [Crash Course]', 'TechWorld with Nana'],
    '7KCS70sCoK0': ['Complete Jenkins Pipeline Tutorial | Jenkinsfile explained', 'TechWorld with Nana'],
    pMO26j2OUME: ['Run Jenkins in Docker Container - Jenkins Pipeline Tutorial for Beginners 1/4', 'TechWorld with Nana'],
    tuxO7ZXplRE: ['Create Multibranch Pipeline with Git - Jenkins Pipeline Tutorial for Beginners 2/4', 'TechWorld with Nana'],
    MY1w7sWW5ms: ['Jenkinsfile - Jenkins Pipeline Tutorial for Beginners 3/4', 'TechWorld with Nana'],
    CmwTPxdx24Y: ['Trigger Jenkins Build automatically - Jenkins Pipeline Tutorial for Beginners 4/4', 'TechWorld with Nana'],
    'zqi4fDF-S60': ['CI/CD with JetBrains TeamCity | TeamCity Tutorial', 'TechWorld with Nana'],
    '4BibQ69MD8c': ['Azure DevOps Tutorial for Beginners | CI/CD with Azure Pipelines', 'TechWorld with Nana'],
    gLJdrXPn0ns: ['DevSecOps Tutorial for Beginners | CI Pipeline with GitHub Actions and Docker Scout', 'TechWorld with Nana'],
    MeU5_k9ssrs: ['ArgoCD Tutorial for Beginners | GitOps CD for Kubernetes', 'TechWorld with Nana'],
    // Programmer Zaman Now
    PhCrso3J11k: ['Belajar Microservices - 1 Intro', 'Programmer Zaman Now'],
    CHBfpPMILaQ: ['Belajar Microservices - 2 Arsitektur Monolith', 'Programmer Zaman Now'],
    W96gPBQ0blE: ['Belajar Microservices - 3 Arsitektur Microservices', 'Programmer Zaman Now'],
    'W4G-cr5m5Do': ['Belajar Microservices - 4 Database per Service', 'Programmer Zaman Now'],
    jYuo2_DMasI: ['Belajar Microservices - 5 Shared Database', 'Programmer Zaman Now'],
    Pw34eg_6ve4: ['Belajar Microservices - 6 NoSQL', 'Programmer Zaman Now'],
    Rsi8mxVX70M: ['Belajar Microservices - 7 Remote Procedure Invocation', 'Programmer Zaman Now'],
    IgJ8RBsRGoM: ['Belajar Microservices - 8 Messaging', 'Programmer Zaman Now'],
    SFkPLgpFiT4: ['Belajar Microservices - 9 Type of Microservices', 'Programmer Zaman Now'],
    WTLGEsmKves: ['Belajar Microservices - 10 Service Orchestration', 'Programmer Zaman Now'],
    zgu2r3_2i_E: ['Belajar Microservices - 11 Service Choreography', 'Programmer Zaman Now'],
    '6qzD87wQTDA': ['Belajar Microservices - 12 API Gateway', 'Programmer Zaman Now'],
    JZ8CW5tgXuY: ['Belajar Microservices - 13 Authentication dan Authorization', 'Programmer Zaman Now'],
    xd3SDxCd38U: ['Belajar Microservices - 14 Backend for Frontend', 'Programmer Zaman Now'],
    'eei78T5Nz-U': ['Belajar Microservices - 15 CQRS (Command Query Responsibility Segregation)', 'Programmer Zaman Now'],
    '3yBWxHh2PU4': ['Belajar Microservices - 16 Server Side Discovery', 'Programmer Zaman Now'],
    TFLw28SIH7o: ['Belajar Microservices - 17 Client Side Discovery', 'Programmer Zaman Now'],
    uoPVeGOUwv0: ['Belajar Microservices - 18 Service Registry', 'Programmer Zaman Now'],
    '0Ipubljd2ZU': ['Belajar Microservices - 19 Centralized Configuration', 'Programmer Zaman Now'],
    aZWbBcgS16s: ['API GATEWAY #SoftwareArchitecture 5', 'Programmer Zaman Now'],
    'YIBDd-nG3hc': ['Belajar Redis - 1 Pengenalan Redis', 'Programmer Zaman Now'],
    dmGTAl6HZDw: ['Belajar Redis - 3 Menginstall Redis', 'Programmer Zaman Now'],
    mcx6AUO6w8I: ['Belajar Redis - 5 Database', 'Programmer Zaman Now'],
    dRKrtQ8LXzE: ['Belajar Redis - 6 Strings', 'Programmer Zaman Now'],
    '6Un1kcmWK-Q': ['Belajar Redis - 7 Expiration', 'Programmer Zaman Now'],
    'X_1-0tBdb-I': ['Tutorial Redis Data Structure (Bahasa Indonesia)', 'Programmer Zaman Now'],
    YVJi3X5Iotw: ['Belajar Redis - 11 Transaction', 'Programmer Zaman Now'],
    ej8NveP_xcc: ['Tutorial Redis PubSub (Bahasa Indonesia)', 'Programmer Zaman Now'],
    NuxYNEYydHM: ['Belajar Redis - 10 Pipeline', 'Programmer Zaman Now'],
    VSuli0vwMuA: ['Belajar Redis - 19 Eviction', 'Programmer Zaman Now'],
    sz4ynvNkt2o: ['Belajar Redis - 18 Persistence', 'Programmer Zaman Now'],
    '6xyjNouHZf8': ['Belajar Redis - 17 Authorization', 'Programmer Zaman Now'],
    // Kong (official channel)
    sJEID1xEZMg: ["Installing Kong's API Gateway with Docker", 'Kong'],
    kGZyAEVioWg: ['Kong Gateway for Beginners: Adding a Service, Route and Plugins', 'Kong'],
    '8SVSohiIhUk': ['API Gateway decK With CI/CD', 'Kong'],
    '1hRogjrzlJY': ['Developing a Kong Gateway Plugin With Go', 'Kong'],
    '4qmu7jSODoY': ['How to Use the Kong Gateway Key Authentication Plugin', 'Kong'],
    'hrYqGXU-a6E': ['Getting Started with Kong Ingress Controller for Kubernetes', 'Kong'],
    GJRbpQth3QY: ['APM with Prometheus and Grafana on Kubernetes Ingress', 'Kong']
  };

  const NOTES = {
    I1V9YWqRIeI: 'Satu kursus penuh yang mendampingi seluruh kelas, bukan video khusus modul ini.',
    rjjES5IsPdg: 'Video diputar dari bagian yang membahas modul ini.',
    'X_1-0tBdb-I': 'Satu video yang membahas semua struktur data Redis.',
    '8JJ101D3knE': 'Satu video dasar Git yang mendampingi modul 1–6.'
  };

  function formatStart(seconds) {
    const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = seconds % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0');
  }

  window.kodelokaVideo = function (id, options) {
    const start = (options && options.start) || 0;
    const iframe = document.getElementById('youtubeIframe');
    const frame = iframe && iframe.closest('.video-player-container');
    const title = document.getElementById('videoTitleMeta');
    const desc = document.getElementById('videoDescMeta');
    const link = document.getElementById('videoDirectLink');
    const info = id ? VIDEOS[id] : null;
    if (!info) {
      if (iframe) iframe.removeAttribute('src');
      if (frame) frame.style.display = 'none';
      if (title) title.textContent = 'Belum ada video untuk modul ini';
      if (desc) desc.textContent = 'Kodeloka hanya memasang video yang benar-benar membahas topik modulnya, dan untuk modul ini belum ada. Materi tertulis, praktik, dan kuisnya tetap lengkap.';
      if (link) link.style.display = 'none';
      return;
    }
    if (frame) frame.style.display = '';
    if (iframe) iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0' + (start ? '&start=' + start : '');
    if (title) title.textContent = info[0];
    if (desc) {
      const note = NOTES[id] ? ' ' + NOTES[id] : '';
      const at = start ? ' Mulai menit ' + formatStart(start) + '.' : '';
      desc.textContent = 'Video dari kanal ' + info[1] + ' di YouTube.' + note + at + ' Kodeloka tidak berafiliasi dengan kanal ini.';
    }
    if (link) {
      link.style.display = '';
      link.href = 'https://www.youtube.com/watch?v=' + id + (start ? '&t=' + start + 's' : '');
      link.rel = 'noopener noreferrer';
    }
  };
})();
