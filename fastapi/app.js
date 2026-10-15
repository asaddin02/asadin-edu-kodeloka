/* FastAPI Playlist Series - Full Course Interactive Learning Platform */

const modulesData = [
  {
    "id": 1,
    "title": "01. Getting Started - Web App + REST API",
    "category": "Dasar & Frontend",
    "videoId": "7AMjmCTumuo",
    "duration": "18:40",
    "description": "Memahami arsitektur FastAPI, pemrograman Asynchronous (async/await), ASGI server Uvicorn, dan dokumentasi OpenAPI otomatis.",
    "keyTakeaways": [
      "FastAPI adalah web framework Python modern berkecepatan tinggi setara dengan NodeJS & Go",
      "Berbasis standar terbuka OpenAPI (Swagger) & JSON Schema",
      "Dukungan penuh untuk fitur Type Hints Python 3.10+ & Asynchronous (async/await)"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📌 Mengapa FastAPI Menjadi Pilihan Utama Developer Python?</h3>
                <p><strong>FastAPI</strong> adalah framework web modern dan berkinerja tinggi buatan Sebastián Ramírez (tiangolo) yang digunakan untuk membangun RESTful API dan Web Application dengan Python. Performa FastAPI hampir setara dengan framework berbasis Go dan Node.js berkat penggunaan <strong>Starlette</strong> (untuk bagian web) dan <strong>Pydantic</strong> (untuk bagian data validation).</p>
                <div class="callout callout-info">
                    <strong>Fitur Utama FastAPI:</strong>
                    <ul>
                        <li><strong>Fast Performance:</strong> Salah satu framework Python tercepat berkat arsitektur ASGI (Asynchronous Server Gateway Interface).</li>
                        <li><strong>Automatic Docs:</strong> Dokumentasi interaktif Swagger UI (<code>/docs</code>) dan ReDoc (<code>/redoc</code>) dibuat secara otomatis tanpa konfigurasi manual!</li>
                        <li><strong>Standard Python Type Hints:</strong> Mengurangi bug pengkodean hingga 40% dengan bantuan auto-complete editor (VSCode / PyCharm).</li>
                        <li><strong>Automatic Data Validation:</strong> Input data dari client di-parse dan divalidasi secara ketat oleh Pydantic v2.</li>
                    </ul>
                </div>
            </div>

            <div class="article-section">
                <h3>⚙️ Perbandingan WSGI vs ASGI (Synchronous vs Asynchronous)</h3>
                <p>Framework Python tradisional seperti Django dan Flask menggunakan spesifikasi <strong>WSGI</strong> (Web Server Gateway Interface) yang bersifat synchronous (blocking). Artinya, jika ada request I/O (seperti query database atau panggilan API eksternal), thread server harus menunggu sampai selesai sebelum dapat melayani request berikutnya.</p>
                <p>FastAPI menggunakan <strong>ASGI</strong> yang mendukung pemrograman asynchronous (<code>async/await</code>) berbasis Python Event Loop. Ketika ada request I/O, server dapat beralih melayani request pengguna lain tanpa harus memblokir thread.</p>
            </div>

            <div class="article-section">
                <h3>💻 Kode Aplikasi Pertama FastAPI</h3>
                <div class="code-container">
                    <div class="code-header"><span>main.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>from fastapi import FastAPI

# Inisialisasi instansi aplikasi FastAPI
app = FastAPI(
    title="My FastAPI Application",
    description="REST API & Full-Stack Web Service",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {"message": "Selamat Datang di FastAPI Learning Platform!", "status": "online"}</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "Minimal FastAPI App",
        "code": "from fastapi import FastAPI\napp = FastAPI()\n\n@app.get('/')\ndef read_root():\n    return {'message': 'Hello FastAPI World'}"
      }
    ],
    "interactiveLab": `from fastapi import FastAPI

app = FastAPI(title="Lab Modul 1")

@app.get("/")
def home():
    return {"status": "success", "framework": "FastAPI", "version": "0.110.0"}`,
    "quiz": [
      {
        "question": "Dua library utama manakah yang menjadi fondasi dasar pembentuk FastAPI?",
        "options": [
          "Django dan Flask",
          "Starlette (Web Routing & ASGI) dan Pydantic (Data Validation)",
          "NumPy dan Pandas",
          "Requests dan BeautifulSoup"
        ],
        "answer": 1,
        "explanation": "FastAPI dibangun di atas Starlette untuk bagian penanganan rute web & ASGI, serta Pydantic untuk penanganan validasi tipe data."
      },
      {
        "question": "Apakah URL endpoint bawaan FastAPI tempat Anda dapat mengakses dokumentasi interaktif Swagger UI secara gratis?",
        "options": [
          "/swagger-ui",
          "/docs",
          "/api-documentation",
          "/redoc-only"
        ],
        "answer": 1,
        "explanation": "FastAPI secara otomatis menyediakan dokumentasi interaktif Swagger UI di URL path /docs."
      },
      {
        "question": "Apakah keunggulan utama dari arsitektur ASGI jika dibandingkan dengan WSGI tradisional?",
        "options": [
          "WSGI lebih cepat dari ASGI",
          "ASGI mendukung pemrograman asynchronous (async/await) non-blocking untuk menangani ribuan koneksi concurrent",
          "ASGI hanya bisa dijalankan di Windows",
          "ASGI tidak bisa membaca file JSON"
        ],
        "answer": 1,
        "explanation": "ASGI memungkinkan eksekusi asynchronous non-blocking sehingga server dapat memproses banyak request I/O secara bersamaan."
      }
    ]
  },
  {
    "id": 2,
    "title": "02. HTML Frontend & Jinja2 Templates",
    "category": "Dasar & Frontend",
    "videoId": "G4NIB9Rx9Qs",
    "duration": "22:15",
    "description": "Menyajikan tampilan HTML interaktif menggunakan Jinja2Templates dan menyajikan berkas statis (CSS/JS) dengan StaticFiles.",
    "keyTakeaways": [
      "Mengintegrasikan Jinja2 template engine untuk Full-Stack Web Development",
      "Menyajikan berkas statis gambar, CSS, dan JavaScript dengan `app.mount('/static', ...)`",
      "Mengirimkan variabel dari Python ke template HTML via `TemplateResponse`"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🌐 Full-Stack HTML Rendering dengan Jinja2</h3>
                <p>Dalam Seri Tutorial Corey Schafer Part 2, selain berfungsi sebagai pembuat REST API murni, FastAPI juga dapat digunakan untuk menyajikan halaman web Full-Stack lengkap dengan tampilan HTML yang di-render di sisi server menggunakan <strong>Jinja2 Templates</strong>.</p>
            </div>

            <div class="article-section">
                <h3>⚙️ Menyiapkan Static Files & Template Engine</h3>
                <p>Untuk menyajikan gambar, file CSS stylesheet, atau script JS client ke browser, kita meng-import <code>StaticFiles</code> dan memetakan folder fisik lokal ke URL path virtual.</p>
            </div>

            <div class="article-section">
                <h3>💻 Kode Rendering Template Jinja2</h3>
                <div class="code-container">
                    <div class="code-header"><span>main.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Mount folder static fisik ke URL /static
app.mount("/static", StaticFiles(directory="static"), name="static")

# Inisialisasi folder template
templates = Jinja2Templates(directory="templates")

@app.get("/posts")
def list_posts(request: Request):
    posts = [
        {"title": "FastAPI Getting Started", "author": "Corey Schafer"},
        {"title": "Pydantic Schemas Guide", "author": "Eko Khannedy"}
    ]
    return templates.TemplateResponse("posts.html", {"request": request, "posts": posts})</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "Jinja2 Setup",
        "code": "from fastapi.templating import Jinja2Templates\ntemplates = Jinja2Templates(directory='templates')"
      }
    ],
    "interactiveLab": `from fastapi import FastAPI, Request

app = FastAPI()

@app.get("/home")
def home(request: Request):
    return {"template": "index.html", "context": {"title": "FastAPI Web"}}`,
    "quiz": [
      {
        "question": "Metode manakah pada FastAPI yang digunakan untuk memetakan folder aset statis (seperti CSS dan gambar) ke rute URL?",
        "options": [
          "app.mount()",
          "app.include_static()",
          "app.static_route()",
          "app.add_folder()"
        ],
        "answer": 0,
        "explanation": "app.mount('/static', StaticFiles(directory='static'), name='static') digunakan untuk menyajikan berkas statis di FastAPI."
      },
      {
        "question": "Parameter wajib apakah yang HARUS selalu disertakan dalam dictionary konteks saat memanggil TemplateResponse di Jinja2?",
        "options": [
          "\"request\": request",
          "\"headers\": headers",
          "\"cookies\": cookies",
          "\"db\": db"
        ],
        "answer": 0,
        "explanation": "Jinja2Templates di FastAPI membutuhkan objek Request asli untuk memproses URL routing bawaan di dalam file HTML."
      },
      {
        "question": "Library bawaan Python manakah yang digunakan oleh FastAPI untuk template engine HTML secara otomatis?",
        "options": [
          "Jinja2",
          "Blade",
          "EJS",
          "Handlebars"
        ],
        "answer": 0,
        "explanation": "FastAPI terintegrasi secara native dengan Jinja2 sebagai template engine HTML."
      }
    ]
  },
  {
    "id": 3,
    "title": "03. Path Parameters & Type Hints",
    "category": "Dasar & Frontend",
    "videoId": "WRjXIA5pMtk",
    "duration": "20:30",
    "description": "Mengambil variabel dari URL path (/posts/{post_id}), konversi tipe otomatis (int, str), dan penanganan Error 422.",
    "keyTakeaways": [
      "Path Parameters mengekstrak nilai langsung dari segmen rute URL",
      "Type hinting `post_id: int` membuat FastAPI mengonversi input string menjadi integer secara otomatis",
      "Validasi otomatis mencegah error runtime akibat tipe data yang salah"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🔍 Parameter Rute (Path Parameters)</h3>
                <p>Path parameters digunakan ketika Anda ingin mengekstrak ID unik atau slug dari segmen URL seperti <code>/posts/101</code>.</p>
                <div class="callout callout-tip">
                    <strong>Konversi Tipe Data Otomatis:</strong> Jika rute mendefinisikan <code>post_id: int</code>, FastAPI akan membaca string <code>"101"</code> dari HTTP Request URL dan mengonversinya menjadi integer Python mentah <code>101</code> secara otomatis!
                </div>
            </div>

            <div class="article-section">
                <h3>💻 Kode Path Parameters & Enum Validation</h3>
                <div class="code-container">
                    <div class="code-header"><span>main.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>from enum import Enum
from fastapi import FastAPI, Path

class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"

app = FastAPI()

@app.get("/models/{model_name}")
def get_model(model_name: ModelName):
    if model_name is ModelName.alexnet:
        return {"model_name": model_name, "message": "Deep Learning Classic!"}
    return {"model_name": model_name, "message": "Model Terdaftar"}

@app.get("/posts/{post_id}")
def get_post_by_id(post_id: int = Path(..., gt=0, description="ID harus integer positif")):
    return {"post_id": post_id, "status": "Active"}</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "Path Parameter Int Validation",
        "code": "@app.get('/posts/{post_id}')\ndef get_post(post_id: int):\n    return {'post_id': post_id}"
      }
    ],
    "interactiveLab": `from fastapi import FastAPI

app = FastAPI()

@app.get("/posts/{post_id}")
def read_post(post_id: int):
    return {"post_id": post_id, "status": "published"}`,
    "quiz": [
      {
        "question": "Apa yang terjadi jika pengguna mengirimkan request GET ke /posts/abc sementara handler menetapkan post_id: int?",
        "options": [
          "FastAPI mengembalikan HTTP 422 Unprocessable Entity secara otomatis",
          "FastAPI mengembalikan HTTP 200 OK",
          "Server Uvicorn akan crash",
          "Aplikasi terhapus"
        ],
        "answer": 0,
        "explanation": "FastAPI secara otomatis melakukan parsing tipe data; jika string 'abc' gagal dikonversi ke int, HTTP 422 dikembalikan."
      },
      {
        "question": "Fungsi bawaan manakah dari fastapi yang digunakan untuk menambahkan metadata & aturan angka (gt, lt) pada Path Parameter?",
        "options": [
          "Path()",
          "Query()",
          "Form()",
          "Body()"
        ],
        "answer": 0,
        "explanation": "Path() digunakan untuk menambahkan atribut validasi spesifik pada path parameter."
      },
      {
        "question": "Bagaimana cara membatasi nilai path parameter hanya pada sekumpulan nilai yang sudah ditentukan (enum)?",
        "options": [
          "Menggunakan Python enum.Enum",
          "Menggunakan regex di HTML",
          "Menggunakan file txt",
          "Menggunakan database"
        ],
        "answer": 0,
        "explanation": "Dengan mendefinisikan kelas turunan Enum, FastAPI hanya mengizinkan nilai yang terdaftar dalam Enum tersebut."
      }
    ]
  },
  {
    "id": 4,
    "title": "04. Query Parameters & Optional Values",
    "category": "Data & Models",
    "videoId": "f1zggIOxmJg",
    "duration": "19:15",
    "description": "Menangani query string (/posts?limit=10&page=1), argumen opsional dengan typing.Optional, dan nilai default.",
    "keyTakeaways": [
      "Argumen fungsi rute yang tidak berada di URL path otomatis diperlakukan sebagai Query Parameter",
      "Memberikan nilai default `limit: int = 10` membuat parameter opsional",
      "Dukungan filtering, pencarian, dan halaman data"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📊 Parameter Kueri (Query Parameters)</h3>
                <p>Query parameters adalah pasangan key-value setelah tanda <code>?</code> pada URL (misal: <code>/posts?limit=5&search=fastapi</code>).</p>
            </div>

            <div class="article-section">
                <h3>💻 Kode Filtering & Pagination dengan Query</h3>
                <div class="code-container">
                    <div class="code-header"><span>main.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
def read_items(
    skip: int = 0,
    limit: int = 10,
    q: Annotated[str | None, Query(min_length=3, max_length=50)] = None
):
    results = {"items": [{"item_name": "Foo"}, {"item_name": "Bar"}]}
    if q:
        results.update({"query": q})
    return results</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "Query Params Example",
        "code": "@app.get('/items')\ndef list_items(skip: int = 0, limit: int = 10):\n    return {'skip': skip, 'limit': limit}"
      }
    ],
    "interactiveLab": `from fastapi import FastAPI

app = FastAPI()

@app.get("/search")
def search(q: str | None = None):
    return {"query": q}`,
    "quiz": [
      {
        "question": "Bagaimanakah cara membuat query parameter bersifat opsional sehingga client tidak wajib mengirimkannya?",
        "options": [
          "Mengisi nilai default (misal q: str | None = None)",
          "Menghapus nama fungsi",
          "Menambahkan kata kunci async",
          "Menggunakan tag HTML"
        ],
        "answer": 0,
        "explanation": "Menetapkan nilai default = None atau angka default membuat parameter tersebut tidak wajib diisi."
      },
      {
        "question": "Fungsi bawaan manakah dari fastapi yang digunakan untuk menambahkan validasi min_length atau regex pada Query Parameter?",
        "options": [
          "Query()",
          "Path()",
          "Header()",
          "Cookie()"
        ],
        "answer": 0,
        "explanation": "Query() digunakan untuk mengonfigurasi Metadata & Aturan Validasi untuk query parameter."
      },
      {
        "question": "Bagaimana cara FastAPI mengetahui bahwa sebuah parameter di fungsi rute adalah Query Parameter dan BUKAN Path Parameter?",
        "options": [
          "Parameter tersebut tidak ada di dalam string rute decorator (misal /items)",
          "Nama parameternya harus diawali huruf Q",
          "Parameter tersebut harus bertipe boolean",
          "Diatur dari file config"
        ],
        "answer": 0,
        "explanation": "Parameter fungsi yang tidak tercantum di segmen URL path otomatis diidentifikasi sebagai Query Parameter."
      }
    ]
  },
  {
    "id": 5,
    "title": "05. Request Body & Pydantic Schemas",
    "category": "Data & Models",
    "videoId": "9GHxnttXxrA",
    "duration": "25:40",
    "description": "Mendefinisikan skema data masukan JSON dengan Pydantic v2 BaseModel, Field validation, dan skema bertingkat.",
    "keyTakeaways": [
      "Mewarisi `pydantic.BaseModel` untuk mendefinisikan skema JSON input",
      "`Field(gt=0, min_length=3)` untuk aturan validasi atribut",
      "Parsing dan konversi tipe JSON otomatis"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📦 Validasi Skema JSON dengan Pydantic</h3>
                <p>Dalam Seri Corey Schafer Part 5, pembuatan postingan baru dilakukan dengan menerima Request Body berupa JSON bertipe Pydantic model.</p>
            </div>

            <div class="article-section">
                <h3>💻 Kode Pydantic Model dengan Field Rules</h3>
                <div class="code-container">
                    <div class="code-header"><span>schemas.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>from pydantic import BaseModel, Field

class PostBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    content: str
    published: bool = True
    rating: int | None = Field(None, ge=1, le=5)

class PostCreate(PostBase):
    pass

from fastapi import FastAPI
app = FastAPI()

@app.post("/posts")
def create_post(post: PostCreate):
    return {"status": "created", "data": post.model_dump()}</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "Pydantic Model Example",
        "code": "from pydantic import BaseModel\nclass PostCreate(BaseModel):\n    title: str\n    content: str\n    published: bool = True"
      }
    ],
    "interactiveLab": `from pydantic import BaseModel
from fastapi import FastAPI

class Post(BaseModel):
    title: str
    content: str

app = FastAPI()

@app.post("/posts")
def create_post(post: Post):
    return {"created": post.title}`,
    "quiz": [
      {
        "question": "Kelas dasar apakah dari pustaka Pydantic yang digunakan untuk membuat skema validasi masukan JSON?",
        "options": [
          "BaseModel",
          "DataClass",
          "PyModel",
          "SchemaBase"
        ],
        "answer": 0,
        "explanation": "pydantic.BaseModel adalah kelas utama untuk membuat skema validasi struktur data JSON di FastAPI."
      },
      {
        "question": "Metode Pydantic v2 manakah yang digunakan untuk mengonversi instance Pydantic model menjadi dictionary Python mentah?",
        "options": [
          ".model_dump()",
          ".dict()",
          ".to_dict()",
          ".json_parse()"
        ],
        "answer": 0,
        "explanation": "Di Pydantic v2, .model_dump() menggantikan metode legacy .dict() untuk mengonversi model ke dictionary."
      },
      {
        "question": "Fungsi Pydantic manakah yang digunakan untuk menetapkan batasan angka (ge, le) atau panjang string pada atribut skema?",
        "options": [
          "Field()",
          "Rule()",
          "Limit()",
          "Check()"
        ],
        "answer": 0,
        "explanation": "pydantic.Field() digunakan untuk mendefinisikan aturan dan contoh metadata atribut skema."
      }
    ]
  },
  {
    "id": 6,
    "title": "06. Form Data & Asynchronous File Uploads",
    "category": "Data & Models",
    "videoId": "AExumWjfbyo",
    "duration": "23:00",
    "description": "Menerima form-data HTML biasa dengan Form() dan mengunggah berkas media (gambar profil) dengan UploadFile.",
    "keyTakeaways": [
      "Menginstal package `python-multipart` untuk menangani form-data",
      "`UploadFile` menggunakan penanganan berbasis file spooled di memori/disk yang sangat efisien",
      "Metode async `.read()`, `.write()`, `.seek()`"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📁 Upload File & Form Processing</h3>
                <p>Untuk mengunggah gambar profil postingan atau dokumen PDF, FastAPI menyediakan kelas khusus <code>UploadFile</code> yang tidak menghabiskan RAM server.</p>
            </div>

            <div class="article-section">
                <h3>💻 Kode Form Data & File Saving</h3>
                <div class="code-container">
                    <div class="code-header"><span>main.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>import shutil
from fastapi import FastAPI, File, UploadFile, Form

app = FastAPI()

@app.post("/upload-avatar/")
async def upload_avatar(
    username: str = Form(...),
    file: UploadFile = File(...)
):
    file_path = f"static/avatars/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"username": username, "avatar_url": file_path}</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "UploadFile Handler",
        "code": "from fastapi import UploadFile, File\n@app.post('/upload')\nasync def upload_image(file: UploadFile = File(...)):\n    return {'filename': file.filename}"
      }
    ],
    "interactiveLab": `from fastapi import FastAPI, File, UploadFile

app = FastAPI()

@app.post("/upload")
async def handle_file(file: UploadFile = File(...)):
    return {"filename": file.filename, "content_type": file.content_type}`,
    "quiz": [
      {
        "question": "Package Python manakah yang wajib diinstall terlebih dahulu agar FastAPI dapat memproses masukan Form() dan UploadFile?",
        "options": [
          "python-multipart",
          "requests",
          "pillow",
          "django-form"
        ],
        "answer": 0,
        "explanation": "FastAPI membutuhkan package python-multipart untuk memuat parsing HTTP multipart/form-data."
      },
      {
        "question": "Mengapa UploadFile lebih efisien dibanding menerima file bertipe bytes mentah pada file berukuran besar?",
        "options": [
          "UploadFile menggunakan memori ter-spooling di disk sehingga RAM server tidak habis",
          "UploadFile mengubah file jadi teks",
          "UploadFile menghapus file",
          "Hanya mitos"
        ],
        "answer": 0,
        "explanation": "UploadFile secara cerdas mengalokasikan file besar ke temporary disk agar tidak membebani memori RAM server."
      },
      {
        "question": "Metode asynchronous apakah pada UploadFile yang digunakan untuk membaca konten berkas secara bertahap?",
        "options": [
          "await file.read()",
          "file.open()",
          "file.get()",
          "file.parse()"
        ],
        "answer": 0,
        "explanation": "await file.read() membaca byte berkas secara asynchronous."
      }
    ]
  },
  {
    "id": 7,
    "title": "07. Response Models & Error Handling",
    "category": "Data & Models",
    "videoId": "9GHxnttXxrA",
    "duration": "21:50",
    "description": "Filter data keluaran dengan response_model, menetapkan HTTP status code standar, dan melempar HTTPException.",
    "keyTakeaways": [
      "Argumen `response_model=PostOut` menyaring atribut sensitif sebelum dikirim ke client",
      "`status_code=status.HTTP_201_CREATED` menetapkan HTTP status code standar",
      "Melempar `raise HTTPException(status_code=404, detail='Not Found')`"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🛡️ Penyaringan Response & Handling Exception</h3>
                <p>Menjaga keamanan data keluaran dengan menyaring field internal dan memberikan rincian error HTTP yang jelas menggunakan <code>HTTPException</code>.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "HTTPException Usage",
        "code": "from fastapi import HTTPException, status\nif not post:\n    raise HTTPException(status_code=404, detail='Post not found')"
      }
    ],
    "interactiveLab": `from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.get("/posts/{id}")
def get_post(id: int):
    if id > 100:
        raise HTTPException(status_code=404, detail="Post Not Found")
    return {"id": id}`,
    "quiz": [
      {
        "question": "Fungsi bawaan manakah yang digunakan untuk melempar error HTTP berkode kustom (seperti 404 Not Found) di FastAPI?",
        "options": [
          "raise HTTPException(status_code=..., detail=...)",
          "throw Error()",
          "return Error404()",
          "stop_server()"
        ],
        "answer": 0,
        "explanation": "raise HTTPException() adalah standar FastAPI untuk mengembalikan respons error HTTP beserta detail pesan."
      },
      {
        "question": "Atribut decorator rute apakah yang menentukan HTTP status code sukses saat handler selesai dieksekusi?",
        "options": [
          "status_code=",
          "response_code=",
          "http_status=",
          "code="
        ],
        "answer": 0,
        "explanation": "status_code=status.HTTP_201_CREATED menentukan kode status HTTP untuk respons sukses."
      },
      {
        "question": "Apakah kegunaan opsi response_model_exclude_unset=True pada decorator rute?",
        "options": [
          "Membuang atribut skema yang tidak diisi oleh pengguna (default values tidak ikut terkirim)",
          "Menghapus database",
          "Mengunci server",
          "Menghapus token"
        ],
        "answer": 0,
        "explanation": "response_model_exclude_unset=True mengabaikan bidang skema yang tidak diset secara eksplisit."
      }
    ]
  },
  {
    "id": 8,
    "title": "08. Adding a Database (SQLAlchemy Setup & Session)",
    "category": "Database & Auth",
    "videoId": "NvOV3ig2tGY",
    "duration": "32:10",
    "description": "Menghubungkan aplikasi ke database PostgreSQL / SQLite menggunakan SQLAlchemy 2.0 ORM dan SessionLocal pattern.",
    "keyTakeaways": [
      "Konfigurasi `create_engine` dan `sessionmaker` di `database.py`",
      "Mendesain model ORM dengan `class Base(DeclarativeBase)` (gaya SQLAlchemy 2.0)",
      "Membuka dan menutup sesi database menggunakan generator (`yield db`)"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🗄️ Menghubungkan FastAPI dengan Database ORM</h3>
                <p>Dalam Seri Corey Schafer Part 8, aplikasi dikembangkan dari database sementara di memori menjadi persisten dengan **SQLAlchemy 2.0** dan PostgreSQL/SQLite.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "SQLAlchemy Engine Setup",
        "code": "from sqlalchemy import create_engine\nfrom sqlalchemy.orm import DeclarativeBase, sessionmaker\n\nclass Base(DeclarativeBase):\n    pass\n\nengine = create_engine('sqlite:///./sql_app.db')\nSessionLocal = sessionmaker(bind=engine)"
      }
    ],
    "interactiveLab": `from fastapi import FastAPI, Depends

def get_db():
    db = "Connected Session"
    try:
        yield db
    finally:
        pass

app = FastAPI()

@app.get("/db-check")
def db_check(db: str = Depends(get_db)):
    return {"status": db}`,
    "quiz": [
      {
        "question": "Mengapa kita menggunakan kata kunci yield pada fungsi dependency get_db()?",
        "options": [
          "Agar sesi database otomatis ditutup di blok finally setelah rute selesai memproses request",
          "Agar database berjalan lebih cepat",
          "Agar tabel terhapus",
          "Hanya formalitas"
        ],
        "answer": 0,
        "explanation": "yield memungkinkan penutupan sesi database secara otomatis dan aman guna mencegah kehabisan batas koneksi."
      },
      {
        "question": "Fungsi SQLAlchemy manakah yang digunakan untuk membuat koneksi engine awal ke string URL database?",
        "options": [
          "create_engine()",
          "make_db()",
          "connect()",
          "bind_engine()"
        ],
        "answer": 0,
        "explanation": "create_engine() membuat objek Engine SQLAlchemy yang terhubung ke database target."
      },
      {
        "question": "Apakah fungsi dari SessionLocal yang dibuat via sessionmaker()?",
        "options": [
          "Pabrik pembuat instansi sesi database untuk setiap request HTTP",
          "Alat pembuat tabel HTML",
          "Server uvicorn",
          "Validator Pydantic"
        ],
        "answer": 0,
        "explanation": "SessionLocal adalah kelas pabrik yang menghasilkan instansi Sesi SQLAlchemy baru."
      }
    ]
  },
  {
    "id": 9,
    "title": "09. Database Models, Relationships & CRUD",
    "category": "Database & Auth",
    "videoId": "VyoGAoxQhxM",
    "duration": "30:45",
    "description": "Mendesain tabel SQLAlchemy (User & Post), relasi One-to-Many (ForeignKey), dan operasi CRUD (Create, Read, Update, Delete).",
    "keyTakeaways": [
      "Mendefinisikan kolom dengan `Column(Integer, primary_key=True)`, `Column(String)`",
      "Relasi antar tabel dengan `ForeignKey('users.id')` dan `relationship()`",
      "Melakukan `db.add()`, `db.commit()`, `db.refresh()`"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🗄️ Relasi Tabel & Operasi CRUD Database</h3>
                <p>Menghubungkan tabel users dan posts dengan relasi 1-to-N di mana satu user dapat memiliki banyak postingan blog.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "SQLAlchemy Relation Example",
        "code": "class Post(Base):\n    __tablename__ = 'posts'\n    id = Column(Integer, primary_key=True)\n    title = Column(String)\n    owner_id = Column(Integer, ForeignKey('users.id'))"
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>🗄️ ORM Relationship Schema</h3>
      <div>User Table (1) ➔ Posts Table (N)</div>
      <div>ForeignKey: <code>posts.owner_id ➔ users.id</code></div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Perintah SQLAlchemy manakah yang digunakan untuk menyimpan perubahan objek baru ke dalam database secara permanen?",
        "options": [
          "db.commit()",
          "db.save()",
          "db.push()",
          "db.close()"
        ],
        "answer": 0,
        "explanation": "db.commit() mengeksekusi perintah SQL COMMIT untuk menyimpan transaksi ke database secara permanen."
      },
      {
        "question": "Fungsi SQLAlchemy manakah yang digunakan untuk mengambil data ID terbaru dari database setelah db.commit() dijalankan?",
        "options": [
          "db.refresh(object)",
          "db.update(object)",
          "db.fetch()",
          "db.sync()"
        ],
        "answer": 0,
        "explanation": "db.refresh(obj) memperbarui atribut instance (seperti auto-increment ID) dari database."
      },
      {
        "question": "Atribut SQLAlchemy manakah yang digunakan untuk mendefinisikan relasi dua arah antar objek model?",
        "options": [
          "relationship()",
          "connect()",
          "foreign()",
          "link()"
        ],
        "answer": 0,
        "explanation": "relationship() mendefinisikan relasi tingkat ORM antar dua kelas tabel."
      }
    ]
  },
  {
    "id": 10,
    "title": "10. Database Migrations dengan Alembic",
    "category": "Database & Auth",
    "videoId": "e8NnDz8uT7o",
    "duration": "24:30",
    "description": "Mengelola perubahan skema database terversi menggunakan Alembic migrations tanpa merusak data produksi.",
    "keyTakeaways": [
      "Inisialisasi Alembic dengan `alembic init alembic`",
      "Menghubungkan `env.py` dengan `target_metadata = Base.metadata`",
      "Membuat dan menerapkan migrasi dengan `alembic revision --autogenerate` & `alembic upgrade head`"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🔄 Migrasi Database dengan Alembic</h3>
                <p>Mengamankan evolusi skema tabel database di lingkungan produksi menggunakan perintah migrasi terautomasi.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "bash",
        "title": "Alembic Upgrade",
        "code": "alembic revision --autogenerate -m \"add_posts_table\"\nalembic upgrade head"
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>🔄 Alembic Migration Status</h3>
      <div>Applied Revision: <code>v1.0_create_posts_table</code></div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Perintah apakah yang digunakan untuk membuat file skrip migrasi baru secara otomatis berdasarkan perubahan model SQLAlchemy Anda?",
        "options": [
          "alembic revision --autogenerate -m 'pesan'",
          "alembic new",
          "alembic create table",
          "alembic sync"
        ],
        "answer": 0,
        "explanation": "alembic revision --autogenerate membandingkan model SQLAlchemy Anda dengan database dan menghasilkan file revisi otomatis."
      },
      {
        "question": "Perintah Alembic manakah yang digunakan untuk membatalkan (rollback) satu tahap migrasi skema sebelumnya?",
        "options": [
          "alembic downgrade -1",
          "alembic undo",
          "alembic delete",
          "alembic reset"
        ],
        "answer": 0,
        "explanation": "alembic downgrade -1 mengembalikan skema database ke satu versi sebelum revisi saat ini."
      },
      {
        "question": "Di dalam file alembic env.py, variabel apakah yang harus diset agar opsi --autogenerate mengenali model SQLAlchemy kita?",
        "options": [
          "target_metadata = Base.metadata",
          "db_url = ...",
          "tables = []",
          "auto = True"
        ],
        "answer": 0,
        "explanation": "target_metadata memberitahu Alembic skema metadata tempat seluruh model ORM terdaftar."
      }
    ]
  },
  {
    "id": 11,
    "title": "11. Dependency Injection System (Depends)",
    "category": "Database & Auth",
    "videoId": "MY0TFMMm9B0",
    "duration": "26:00",
    "description": "Menguasai sistem Dependency Injection FastAPI dengan Depends(), reutilisasi logika koneksi DB & otentikasi user.",
    "keyTakeaways": [
      "Dependency Injection berbagi logika antar rute secara modular",
      "Dipanggil dengan `Depends(get_db)` pada parameter rute",
      "Mendukung hierarki nested dependencies"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>💉 Injeksi Dependensi di FastAPI</h3>
                <p>Memahami bagaimana FastAPI mengalirkan sesi database dan verifikasi otentikasi secara bersih tanpa duplikasi kode.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "Depends Injection Example",
        "code": "def common_params(skip: int = 0, limit: int = 10):\n    return {'skip': skip, 'limit': limit}\n\n@app.get('/items')\ndef read_items(params: dict = Depends(common_params)):\n    return params"
      }
    ],
    "interactiveLab": `from fastapi import FastAPI, Depends

def get_user_agent(user_agent: str = "Mozilla"):
    return user_agent

app = FastAPI()

@app.get("/agent")
def read_agent(agent: str = Depends(get_user_agent)):
    return {"user_agent": agent}`,
    "quiz": [
      {
        "question": "Fungsi bawaan FastAPI apakah yang digunakan untuk mendeklarasikan dependensi pada handler rute?",
        "options": [
          "Depends()",
          "Inject()",
          "Require()",
          "Use()"
        ],
        "answer": 0,
        "explanation": "Depends() adalah fungsi deklarator dependensi resmi di FastAPI."
      },
      {
        "question": "Dapatkah sebuah fungsi dependency memanggil dependency lainnya (nested dependency)?",
        "options": [
          "Ya, FastAPI mendukung hierarki dependency bersarang tanpa batas",
          "Tidak bisa sama sekali",
          "Hanya maksimal 1 tingkat",
          "Hanya di versi Linux"
        ],
        "answer": 0,
        "explanation": "FastAPI secara otomatis menyelesaikan pohon dependensi bersarang (sub-dependencies) sebelum rute utama dijalankan."
      },
      {
        "question": "Apakah keuntungan menggunakan kelas sebagai dependency (Class as Dependency) dibanding fungsi biasa?",
        "options": [
          "Dapat menyimpan state dan konfigurasi parameter dengan lebih terstruktur",
          "Menghapus file python",
          "Mencegah koneksi internet",
          "Mengubah tipe data ke C++"
        ],
        "answer": 0,
        "explanation": "Class Dependency memungkinkan pembuatan instance yang menyimpan state dan konfigurasi reusable."
      }
    ]
  },
  {
    "id": 12,
    "title": "12. Password Hashing & Security dengan pwdlib (Argon2)",
    "category": "Database & Auth",
    "videoId": "Go4wYJJhR3k",
    "duration": "28:15",
    "description": "Mengamankan password pengguna dengan algoritma hashing 1-way (Bcrypt/Argon2) menggunakan pwdlib PasswordHash.recommended().",
    "keyTakeaways": [
      "Password mentah DILARANG disimpan di database!",
      "Menggunakan `PasswordHash.recommended()` dari pwdlib (Argon2 + bcrypt)",
      "Verifikasi login dengan `password_hash.verify(plain, hashed)`"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🔒 Hashing Password Keamanan Tinggi</h3>
                <p>Mengamankan kredensial akun pengguna dengan hashing satu arah sebelum disimpan ke tabel database. Hashing berbeda dari enkripsi: ia <strong>tidak bisa dibalik</strong>, sehingga bocornya isi tabel tidak langsung membocorkan password.</p>
            </div>

            <div class="article-section">
                <div class="callout callout-warning">
                    <strong>⚠️ Jangan pakai passlib lagi.</strong>
                    <p>Banyak tutorial lama memakai <code>passlib.context.CryptContext</code>. Passlib sudah <strong>tidak dipelihara</strong> (rilis stabil terakhir 1.7.4 tahun 2020) dan rusak ketika dipasangkan dengan <code>bcrypt</code> versi 4.1 ke atas karena pembacaan atribut <code>__about__</code> yang sudah dihapus. Dokumentasi resmi FastAPI kini memakai <strong>pwdlib</strong>.</p>
                    <pre><code>pip install "pwdlib[argon2,bcrypt]"</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>🧂 Kenapa Argon2 Lebih Dianjurkan dari Bcrypt</h3>
                <ul>
                    <li><strong>Argon2id</strong> adalah pemenang Password Hashing Competition dan direkomendasikan OWASP. Ia mahal di <em>memori</em>, bukan hanya di CPU, sehingga jauh lebih tahan terhadap serangan GPU/ASIC.</li>
                    <li><strong>Bcrypt</strong> masih aman, tetapi punya batas keras <strong>72 byte</strong> — karakter setelah byte ke-72 diam-diam diabaikan. Ini jebakan nyata untuk password panjang atau passphrase.</li>
                    <li><code>PasswordHash.recommended()</code> memakai Argon2 untuk hash baru namun tetap bisa <em>memverifikasi</em> hash bcrypt lama, sehingga migrasi bisa bertahap.</li>
                </ul>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "pwdlib Hashing (Argon2)",
        "code": "from pwdlib import PasswordHash\n\npassword_hash = PasswordHash.recommended()\n\ndef hash_password(plain: str) -> str:\n    return password_hash.hash(plain)\n\ndef verify_password(plain: str, hashed: str) -> bool:\n    return password_hash.verify(plain, hashed)"
      }
    ],
    "interactiveLab": `from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

hashed = password_hash.hash("password123")
print("Argon2 Hash:", hashed)
print("Cocok?", password_hash.verify("password123", hashed))
print("Salah?", password_hash.verify("password-salah", hashed))`,
    "quiz": [
      {
        "question": "Metode manakah pada objek PasswordHash (pwdlib) yang digunakan untuk mencocokkan password mentah dari form login dengan hash di database?",
        "options": [
          "password_hash.verify(plain_password, hashed_password)",
          "password_hash.check()",
          "password_hash.compare()",
          "password_hash.decrypt()"
        ],
        "answer": 0,
        "explanation": "password_hash.verify() melakukan hashing ulang password mentah memakai salt & parameter yang tersimpan di dalam string hash, lalu membandingkannya secara constant-time. Hash TIDAK pernah bisa di-'decrypt' karena hashing bersifat satu arah."
      },
      {
        "question": "Apakah yang dimaksud dengan konsep 1-way hashing pada password?",
        "options": [
          "Proses enkripsi satu arah yang secara matematis tidak dapat di-dekripsi kembali menjadi password mentah",
          "Proses dua arah yang bisa di-dekripsi",
          "Proses kompresi gambar",
          "Pola penamaan variabel"
        ],
        "answer": 0,
        "explanation": "1-way hashing tidak dapat di-reverse atau di-dekripsi; verifikasi dilakukan dengan membandingkan nilai hash baru."
      },
      {
        "question": "Mengapa penggunaan salt (bawaan algoritma Bcrypt) sangat penting saat membuat hash password?",
        "options": [
          "Memastikan dua password yang identik menghasilkan string hash yang berbeda untuk menggagalkan Rainbow Table Attack",
          "Membuat hash jadi lebih pendek",
          "Menghapus password",
          "Mempercepat jaringan"
        ],
        "answer": 0,
        "explanation": "Salt acak memastikan dua password yang sama menghasilkan string hash yang berbeda."
      }
    ]
  },
  {
    "id": 13,
    "title": "13. User Registration & Login Flow",
    "category": "Database & Auth",
    "videoId": "Go4wYJJhR3k",
    "duration": "31:00",
    "description": "Membangun alur pendaftaran akun pengguna, cek keunikan email/username, dan penerbitan token sesi.",
    "keyTakeaways": [
      "Endpoint `/register` menerima UserCreate schema & menyimpan hashed password",
      "Endpoint `/login` memverifikasi kredensial & mengembalikan token",
      "Menangani error status code `400 Bad Request` untuk email duplikat"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>👤 Alur Registrasi & Login Pengguna</h3>
                <p>Menghubungkan skema Pydantic, hashing pwdlib, dan model database SQLAlchemy untuk membuat alur autentikasi utuh.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "User Register Flow",
        "code": "@app.post('/register')\ndef register(user: UserCreate, db: Session = Depends(get_db)):\n    hashed = hash_password(user.password)\n    new_user = User(email=user.email, password=hashed)\n    db.add(new_user); db.commit()\n    return new_user"
      }
    ],
    "interactiveLab": `from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.post("/login")
def login(username: str):
    if username != "corey":
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    return {"access_token": "demo_token_123", "token_type": "bearer"}`,
    "quiz": [
      {
        "question": "Mengapa kita harus mengecek apakah email pengguna sudah ada di database sebelum mendaftarkan akun baru?",
        "options": [
          "Untuk mencegah terjadinya duplikasi email dan kesalahan constraint unik di database",
          "Agar server tidak kehabisan memori",
          "Agar gambar terhapus",
          "Hanya formalitas"
        ],
        "answer": 0,
        "explanation": "Mengecek ketersediaan email sebelum insert mencegah terjadinya kesalahan duplikasi data di database."
      },
      {
        "question": "Tipe data tokenapakah yang disarankan secara standar oleh spesifikasi OAuth2 dalam respons login?",
        "options": [
          "\"token_type\": \"bearer\"",
          "\"token_type\": \"basic\"",
          "\"token_type\": \"cookie\"",
          "\"token_type\": \"session\""
        ],
        "answer": 0,
        "explanation": "Spesifikasi OAuth2 mensyaratkan kunci \"token_type\": \"bearer\" dalam respons JSON autentikasi."
      },
      {
        "question": "Kelas bawaan FastAPI manakah yang digunakan untuk membaca form masukan username dan password standar OAuth2 pada endpoint login?",
        "options": [
          "OAuth2PasswordRequestForm",
          "LoginForm",
          "UserAuthForm",
          "BodyForm"
        ],
        "answer": 0,
        "explanation": "OAuth2PasswordRequestForm membaca bidang username dan password dari request body form-data."
      }
    ]
  },
  {
    "id": 14,
    "title": "14. Authentication & Authorization dengan JWT Tokens",
    "category": "Database & Auth",
    "videoId": "MY0TFMMm9B0",
    "duration": "36:30",
    "description": "Membuat dan mengekstrak JSON Web Tokens (JWT), menentukan masa berlaku token, dan mengamankan rute terproteksi.",
    "keyTakeaways": [
      "Stateless Authentication dengan `pyjwt`",
      "Struktur JWT: Header, Payload (exp, sub), Signature",
      "Dependency `get_current_user` dengan `OAuth2PasswordBearer`"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🔑 Autentikasi Stateless dengan JWT</h3>
                <p>Menilai kelayakan token JWT pada setiap rute terproteksi dengan menguji tanda tangan kriptografi dan batas kedaluwarsa token.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "JWT Token Generation",
        "code": "import jwt\nfrom datetime import datetime, timedelta\ndef create_token(data: dict):\n    data.update({'exp': datetime.utcnow() + timedelta(minutes=30)})\n    return jwt.encode(data, 'SECRET_KEY', algorithm='HS256')"
      }
    ],
    "interactiveLab": `import jwt

SECRET = "mysecretkey"
token = jwt.encode({"sub": "user_id_99"}, SECRET, algorithm="HS256")
print("Generated Token:", token)`,
    "quiz": [
      {
        "question": "Skema autentikasi HTTP manakah yang paling umum digunakan untuk mempassing token JWT di Header request (Authorization: Bearer <token>)?",
        "options": [
          "Bearer Token",
          "Basic Auth",
          "Digest Auth",
          "API Key Query"
        ],
        "answer": 0,
        "explanation": "Standard OAuth2 menggunakan skema Bearer Token pada HTTP Header Authorization."
      },
      {
        "question": "Komponen JWT manakah yang menyimpan klaim data pengguna (seperti user_id) dan batas waktu kadaluwarsa (exp)?",
        "options": [
          "Payload",
          "Header",
          "Signature",
          "Cookie"
        ],
        "answer": 0,
        "explanation": "Payload menyimpan klaim informasi terenkode Base64 seperti sub (subject) dan exp (expiration time)."
      },
      {
        "question": "Fungsi PyJWT manakah yang digunakan untuk mengonversi kembali token JWT menjadi dictionary klaim asli di server?",
        "options": [
          "jwt.decode(token, SECRET_KEY, algorithms=['HS256'])",
          "jwt.parse()",
          "jwt.unpack()",
          "jwt.verify()"
        ],
        "answer": 0,
        "explanation": "jwt.decode() memverifikasi tanda tangan kriptografi dan membaca payload dictionary dari string JWT."
      }
    ]
  },
  {
    "id": 15,
    "title": "15. APIRouter & Project Modular Structuring",
    "category": "Advanced & Deploy",
    "videoId": "NkgIHa6KtHg",
    "duration": "27:10",
    "description": "Memecah kode aplikasi menjadi modul-modul independen menggunakan APIRouter (users.py, posts.py, auth.py).",
    "keyTakeaways": [
      "Menggunakan `APIRouter(prefix='/posts', tags=['Posts'])`",
      "Mendaftarkan router modular di `main.py` via `app.include_router(posts_router)`",
      "Menjaga keterbacaan kode pada aplikasi skala enterprise"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🗂️ Arsitektur Proyek Modular dengan APIRouter</h3>
                <p>Mengelompokkan rute berdasarkan domain bisnis (User, Post, Auth) agar basis kode mudah dikelola oleh tim developer.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "APIRouter Example",
        "code": "from fastapi import APIRouter\nrouter = APIRouter(prefix='/posts', tags=['Posts'])\n@router.get('/')\ndef get_posts(): return []"
      }
    ],
    "interactiveLab": `from fastapi import FastAPI, APIRouter

post_router = APIRouter(prefix="/posts", tags=["Posts"])

@post_router.get("/")
def list_posts():
    return [{"id": 1, "title": "FastAPI Course"}]

app = FastAPI()
app.include_router(post_router)`,
    "quiz": [
      {
        "question": "Metode manakah yang digunakan untuk menggabungkan instance APIRouter ke dalam aplikasi FastAPI utama?",
        "options": [
          "app.include_router()",
          "app.add_route()",
          "app.use()",
          "app.attach()"
        ],
        "answer": 0,
        "explanation": "app.include_router() berfungsi menghubungkan rute dari modul APIRouter ke instansi FastAPI utama."
      },
      {
        "question": "Apakah fungsi dari argumen prefix='/users' saat mendefinisikan objek APIRouter?",
        "options": [
          "Menambahkan awalan URL path /users ke seluruh rute yang terdaftar di dalam router tersebut secara otomatis",
          "Mengubah nama database",
          "Menghapus rute",
          "Menghapus file HTML"
        ],
        "answer": 0,
        "explanation": "Prefix otomatis menambahkan awalan URL pada semua rute anak di router tersebut."
      },
      {
        "question": "Apakah keunggulan utama dari pembagian file proyek ke dalam folder routers/, schemas/, dan models/?",
        "options": [
          "Pemisahan tanggung jawab (Separation of Concerns) yang memudahkan kolaborasi tim dan pemeliharaan kode",
          "Membuat ukuran file lebih besar",
          "Menghapus file python",
          "Tidak ada keunggulannya"
        ],
        "answer": 0,
        "explanation": "Pemisahan struktur meningkatkan keterbacaan, keterujian, dan kemudahan pemeliharaan kode."
      }
    ]
  },
  {
    "id": 16,
    "title": "16. Lifespan Events & Manajemen Sumber Daya Aplikasi",
    "category": "Advanced & Deploy",
    "videoId": null,
    "duration": "14:20",
    "description": "Mengganti on_event yang sudah usang dengan lifespan context manager untuk mengelola pool koneksi, klien HTTP, dan model machine learning.",
    "keyTakeaways": [
      "@app.on_event('startup'/'shutdown') sudah deprecated — gunakan lifespan",
      "Lifespan adalah async context manager: kode sebelum yield saat menyala, sesudah yield saat mati",
      "Pool koneksi dan klien HTTP dibuat SEKALI, bukan per-request",
      "app.state untuk menyimpan objek bersama lintas request"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>⚠️ on_event Sudah Usang</h3>
                <p>Banyak tutorial masih mengajarkan pola lama ini:</p>
                <div class="code-container">
                    <div class="code-header"><span>Pola lama — jangan dipakai lagi</span></div>
                    <pre><code>@app.on_event("startup")
async def mulai():
    ...

@app.on_event("shutdown")
async def berhenti():
    ...</code></pre>
                </div>
                <p>Pola ini <strong>deprecated</strong>. Masalah mendasarnya: kedua fungsi terpisah, sehingga tidak ada cara alami untuk membagikan variabel di antara keduanya, dan tidak ada jaminan pembersihan bila startup gagal di tengah jalan.</p>
            </div>

            <div class="article-section">
                <h3>✅ Lifespan Context Manager</h3>
                <div class="code-container">
                    <div class="code-header"><span>main.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>from contextlib import asynccontextmanager
from fastapi import FastAPI
import httpx
from sqlalchemy.ext.asyncio import create_async_engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── SAAT MENYALA ──────────────────────────────
    engine = create_async_engine(DATABASE_URL, pool_size=20, max_overflow=10)
    klien = httpx.AsyncClient(timeout=10.0)

    app.state.engine = engine
    app.state.klien = klien

    print("aplikasi siap")
    yield                       # ← aplikasi melayani permintaan di sini
    # ── SAAT MATI ─────────────────────────────────
    await klien.aclose()
    await engine.dispose()
    print("sumber daya dilepas")

app = FastAPI(lifespan=lifespan)</code></pre>
                </div>
                <div class="callout callout-info">
                    <strong>💡 Kenapa struktur ini lebih baik</strong>
                    <p>Karena ini <em>context manager</em>, variabel yang dibuat sebelum <code>yield</code> tetap terlihat setelahnya. Anda tidak perlu lagi menaruh objek di variabel global hanya agar fungsi shutdown bisa mengaksesnya. Bila terjadi exception saat aplikasi berjalan, blok setelah <code>yield</code> tetap dijalankan.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🚫 Kesalahan Fatal: Membuat Klien per Request</h3>
                <div class="code-container">
                    <div class="code-header"><span>Salah — membuka koneksi baru setiap kali</span></div>
                    <pre><code>@app.get("/produk")
async def ambil_produk():
    async with httpx.AsyncClient() as klien:      # ❌ TCP handshake tiap request
        r = await klien.get("http://layanan-katalog/produk")
        return r.json()</code></pre>
                </div>
                <div class="code-container">
                    <div class="code-header"><span>Benar — memakai klien bersama dari lifespan</span></div>
                    <pre><code>@app.get("/produk")
async def ambil_produk(request: Request):
    r = await request.app.state.klien.get("http://layanan-katalog/produk")
    return r.json()</code></pre>
                </div>
                <div class="callout callout-warning">
                    <strong>⚠️ Dampaknya besar di bawah beban</strong>
                    <p>Membuat <code>AsyncClient</code> baru untuk setiap permintaan berarti TCP handshake dan negosiasi TLS berulang, tanpa memanfaatkan connection pooling sama sekali. Pada trafik tinggi ini menghabiskan port ephemeral dan menambah latensi puluhan milidetik per panggilan. Klien HTTP dirancang untuk berumur panjang dan dibagikan.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🧩 Dependency yang Mengambil dari State</h3>
                <div class="code-container">
                    <div class="code-header"><span>dependencies.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>from typing import Annotated
from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

async def dapatkan_sesi(request: Request) -> AsyncSession:
    pembuat = async_sessionmaker(request.app.state.engine, expire_on_commit=False)
    async with pembuat() as sesi:
        yield sesi

SesiDB = Annotated[AsyncSession, Depends(dapatkan_sesi)]

# Dipakai di endpoint dengan sangat ringkas:
@app.get("/pesanan/{id}")
async def ambil(id: int, db: SesiDB):
    ...</code></pre>
                </div>
                <div class="callout callout-info">
                    <strong>💡 Alias tipe dengan Annotated</strong>
                    <p>Mendefinisikan <code>SesiDB = Annotated[AsyncSession, Depends(dapatkan_sesi)]</code> sekali lalu memakainya di puluhan endpoint jauh lebih rapi daripada mengulang <code>db: AsyncSession = Depends(dapatkan_sesi)</code> di mana-mana. Ini pola yang dianjurkan dokumentasi resmi FastAPI sekarang.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🏥 Health Check yang Benar</h3>
                <div class="code-container">
                    <div class="code-header"><span>health.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>@app.get("/healthz")           # liveness: HANYA cek proses ini
async def healthz():
    return {"status": "ok"}

@app.get("/readyz")            # readiness: boleh cek dependensi
async def readyz(request: Request):
    try:
        async with request.app.state.engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception:
        raise HTTPException(status_code=503, detail="database tidak siap")
    return {"status": "siap"}</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 Jangan cek database di endpoint liveness</strong>
                    <p>Bila <code>/healthz</code> memeriksa database dan database sedang lambat, Kubernetes akan menganggap <em>semua</em> pod rusak dan membunuh seluruhnya sekaligus — mengubah gangguan database menjadi pemadaman total aplikasi. Liveness hanya boleh menjawab "apakah proses ini masih waras". Ketergantungan eksternal diperiksa readiness, yang cukup menghentikan trafik tanpa membunuh pod.</p>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "Lifespan Lengkap",
        "code": "from contextlib import asynccontextmanager\n\n@asynccontextmanager\nasync def lifespan(app: FastAPI):\n    app.state.klien = httpx.AsyncClient(timeout=10.0)\n    yield\n    await app.state.klien.aclose()\n\napp = FastAPI(lifespan=lifespan)"
      }
    ],
    "interactiveLab": `from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("→ membuka pool database")
    app.state.siap = True
    yield
    print("→ menutup pool database")

app = FastAPI(lifespan=lifespan)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}`,
    "quiz": [
      {
        "question": "Mengapa @app.on_event('startup') sebaiknya diganti dengan lifespan context manager?",
        "options": [
          "Karena on_event sudah deprecated, dan lifespan memungkinkan variabel dibagi antara fase menyala dan mati tanpa variabel global",
          "Karena on_event hanya bekerja pada Python 2",
          "Karena lifespan membuat aplikasi berjalan lebih cepat",
          "Karena on_event tidak mendukung fungsi async"
        ],
        "answer": 0,
        "explanation": "on_event memisahkan startup dan shutdown menjadi dua fungsi yang tidak bisa berbagi lingkup, sehingga objek seperti pool koneksi terpaksa ditaruh di variabel global. Lifespan sebagai async context manager menjaga keduanya dalam satu lingkup dan menjamin pembersihan tetap berjalan."
      },
      {
        "question": "Apa masalah membuat httpx.AsyncClient() baru di dalam setiap endpoint?",
        "options": [
          "Tidak ada masalah, itu praktik yang dianjurkan",
          "Setiap permintaan melakukan TCP handshake dan negosiasi TLS baru tanpa connection pooling, sehingga latensi bertambah dan port ephemeral bisa habis",
          "AsyncClient tidak bisa dipakai di dalam endpoint",
          "FastAPI akan menolak permintaan tersebut"
        ],
        "answer": 1,
        "explanation": "Klien HTTP dirancang untuk berumur panjang agar bisa memakai ulang koneksi. Membuatnya per-request membuang seluruh manfaat pooling, menambah beberapa perjalanan bolak-balik jaringan pada tiap panggilan, dan pada trafik tinggi dapat menguras port yang tersedia."
      }
    ]
  },
  {
    "id": 17,
    "title": "17. Middleware & CORS Configuration",
    "category": "Advanced & Deploy",
    "videoId": null,
    "duration": "23:45",
    "description": "Mengizinkan akses frontend lintas origin dengan CORSMiddleware & membuat middleware kustom pemroses request.",
    "keyTakeaways": [
      "Mengatur `CORSMiddleware` dengan `allow_origins=['http://localhost:3000']`",
      "Menuliskan `@app.middleware('http')` untuk logging execution time",
      "Manipulasi HTTP Header pada request & response"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🌐 Konfigurasi CORS & Middleware</h3>
                <p>Mengatur izin komunikasi aman antara backend FastAPI dengan frontend web SPA (React, Vue, Next.js).</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "CORSMiddleware Setup",
        "code": "from fastapi.middleware.cors import CORSMiddleware\napp.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'])"
      }
    ],
    "interactiveLab": `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"]
)`,
    "quiz": [
      {
        "question": "Kebijakan keamanan browser apakah yang membuat frontend memerlukan konfigurasi CORSMiddleware pada backend FastAPI?",
        "options": [
          "Same-Origin Policy (SOP)",
          "Content Security Policy (CSP)",
          "Strict Transport Security (HSTS)",
          "X-Frame-Options"
        ],
        "answer": 0,
        "explanation": "Browser menerapkan Same-Origin Policy (SOP) yang memblokir request AJAX/Fetch ke domain/port berbeda tanpa header CORS yang sah."
      },
      {
        "question": "Fungsi middleware apakah yang dieksekusi sebelum dan sesudah setiap request HTTP masuk di FastAPI?",
        "options": [
          "@app.middleware('http')",
          "@app.before_request()",
          "@app.filter()",
          "@app.interceptor()"
        ],
        "answer": 0,
        "explanation": "@app.middleware('http') mendefinisikan fungsi async pemroses request HTTP."
      },
      {
        "question": "Atribut CORSMiddleware manakah yang menentukan daftar domain frontend yang diizinkan mengakses API?",
        "options": [
          "allow_origins=",
          "allow_hosts=",
          "allowed_domains=",
          "origins="
        ],
        "answer": 0,
        "explanation": "allow_origins menerima daftar list URL domain frontend yang diperbolehkan."
      }
    ]
  },
  {
    "id": 18,
    "title": "18. Rate Limiting & Perlindungan API",
    "category": "Advanced & Deploy",
    "videoId": null,
    "duration": "15:50",
    "description": "Membatasi laju permintaan dengan algoritma sliding window berbasis Redis, menetapkan kuota per pengguna, serta menambahkan header standar dan security header.",
    "keyTakeaways": [
      "Rate limiting di memori rusak begitu ada lebih dari satu worker",
      "Sliding window dengan Sorted Set Redis lebih akurat daripada fixed window",
      "Balas 429 disertai header Retry-After dan RateLimit-*",
      "Batasi berdasarkan identitas pengguna, bukan hanya alamat IP"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📌 Kenapa Rate Limiting Wajib</h3>
                <ul>
                    <li>Mencegah penyalahgunaan dan pengerukan data otomatis.</li>
                    <li>Melindungi dari serangan tebak-password secara brute force.</li>
                    <li>Menjaga biaya terkendali bila API Anda memanggil layanan berbayar.</li>
                    <li>Menjamin satu klien yang rakus tidak menghabiskan kapasitas untuk semua orang.</li>
                </ul>
            </div>

            <div class="article-section">
                <h3>⚖️ Fixed Window vs Sliding Window</h3>
                <div class="code-container">
                    <pre><code>FIXED WINDOW -- batas 100 permintaan per menit
  10:00:59  →  100 permintaan   ✅ diizinkan
  10:01:01  →  100 permintaan   ✅ diizinkan
  Dalam 2 detik, 200 permintaan lolos. ❌ Ini disebut masalah tepi jendela.

SLIDING WINDOW -- selalu melihat 60 detik terakhir dari saat ini
  10:01:01  →  memeriksa 10:00:01–10:01:01
               sudah ada 100 permintaan  ❌ ditolak</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>💻 Sliding Window dengan Redis</h3>
                <div class="code-container">
                    <div class="code-header"><span>rate_limit.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>import time, uuid
from fastapi import HTTPException, Request

SKRIP_BATAS = """
local kunci     = KEYS[1]
local batas     = tonumber(ARGV[1])
local jendela   = tonumber(ARGV[2])
local sekarang  = tonumber(ARGV[3])
local id        = ARGV[4]

redis.call('ZREMRANGEBYSCORE', kunci, 0, sekarang - jendela * 1000)
local jumlah = redis.call('ZCARD', kunci)

if jumlah >= batas then
  return {0, jumlah}
end

redis.call('ZADD', kunci, sekarang, id)
redis.call('EXPIRE', kunci, jendela)
return {1, jumlah + 1}
"""

async def periksa_batas(r, kunci: str, batas: int, jendela: int):
    sekarang = int(time.time() * 1000)
    izin, jumlah = await r.eval(
        SKRIP_BATAS, 1, kunci, batas, jendela, sekarang, str(uuid.uuid4())
    )
    return bool(izin), jumlah</code></pre>
                </div>
                <div class="callout callout-info">
                    <strong>💡 Kenapa harus skrip Lua</strong>
                    <p>Rangkaian "hitung dulu, lalu putuskan, lalu catat" mengandung balapan bila dijalankan sebagai perintah terpisah: dua permintaan bersamaan bisa sama-sama membaca jumlah 99 dan sama-sama lolos. Skrip Lua dijalankan Redis sebagai satu unit tanpa disela, sehingga keputusannya selalu benar.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🧱 Middleware</h3>
                <div class="code-container">
                    <div class="code-header"><span>middleware.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

class MiddlewareBatas(BaseHTTPMiddleware):
    def __init__(self, app, batas=100, jendela=60):
        super().__init__(app)
        self.batas, self.jendela = batas, jendela

    async def dispatch(self, request: Request, call_next):
        if request.url.path in ("/healthz", "/readyz", "/metrics"):
            return await call_next(request)

        pengenal = self._pengenal(request)
        kunci = f"batas:{pengenal}:{request.url.path}"

        izin, jumlah = await periksa_batas(
            request.app.state.redis, kunci, self.batas, self.jendela
        )

        if not izin:
            return JSONResponse(
                status_code=429,
                content={"detail": "Terlalu banyak permintaan"},
                headers={
                    "Retry-After": str(self.jendela),
                    "RateLimit-Limit": str(self.batas),
                    "RateLimit-Remaining": "0",
                },
            )

        respons = await call_next(request)
        respons.headers["RateLimit-Limit"] = str(self.batas)
        respons.headers["RateLimit-Remaining"] = str(max(0, self.batas - jumlah))
        return respons

    def _pengenal(self, request: Request) -> str:
        # Pengguna terautentikasi dibatasi per identitas, bukan per IP
        if pengguna := getattr(request.state, "pengguna", None):
            return f"pengguna:{pengguna.id}"
        return f"ip:{self._ip_asli(request)}"

    def _ip_asli(self, request: Request) -> str:
        # HANYA percaya header ini bila Anda mengendalikan proxy di depannya
        if xff := request.headers.get("x-forwarded-for"):
            return xff.split(",")[0].strip()
        return request.client.host</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 X-Forwarded-For bisa dipalsukan</strong>
                    <p>Bila aplikasi Anda terjangkau langsung dari internet, siapa pun bisa mengirim <code>X-Forwarded-For: 1.2.3.4</code> palsu dan melewati pembatasan cukup dengan mengacak nilainya. Header ini hanya boleh dipercaya bila ada reverse proxy tepercaya di depan yang <strong>menimpa</strong> nilainya, dan aplikasi tidak bisa dijangkau langsung dari luar.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🎚️ Kuota Berjenjang</h3>
                <div class="code-container">
                    <pre><code>KUOTA = {
    "anonim":  (20,   60),      # 20 per menit
    "gratis":  (100,  60),
    "pro":     (1000, 60),
    "mitra":   (10000, 60),
}

# Batas berbeda untuk endpoint yang mahal
BATAS_ENDPOINT = {
    "/api/cari":        (30,  60),
    "/api/ekspor":      (5,   3600),   # 5 per jam
    "/api/auth/login":  (5,   300),    # anti brute force
}</code></pre>
                </div>
                <div class="callout callout-warning">
                    <strong>⚠️ Endpoint login butuh perlakuan khusus</strong>
                    <p>Batasi <strong>per kombinasi IP dan nama pengguna</strong>, bukan hanya salah satunya. Membatasi hanya per IP membuat penyerang di belakang banyak IP tetap bisa menyerang satu akun; membatasi hanya per nama pengguna memungkinkan penyerang mengunci akun orang lain dengan sengaja gagal login berulang kali.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🛡️ Security Header</h3>
                <div class="code-container">
                    <div class="code-header"><span>security.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>@app.middleware("http")
async def header_keamanan(request: Request, call_next):
    r = await call_next(request)
    r.headers["X-Content-Type-Options"] = "nosniff"
    r.headers["X-Frame-Options"] = "DENY"
    r.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    r.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    r.headers["Content-Security-Policy"] = "default-src 'self'"
    return r

# CORS -- JANGAN pakai allow_origins=["*"] bersama credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://aplikasi.contoh.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 Kombinasi berbahaya pada CORS</strong>
                    <p><code>allow_origins=["*"]</code> bersama <code>allow_credentials=True</code> adalah kesalahan konfigurasi yang serius. Spesifikasi CORS sebenarnya melarang kombinasi ini, dan sebagian implementasi menanganinya dengan cara yang membuka celah: situs mana pun bisa mengirim permintaan dengan cookie pengguna Anda dan membaca responsnya. Selalu daftarkan origin secara eksplisit ketika memakai credentials.</p>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "Respons 429",
        "code": "return JSONResponse(\n    status_code=429,\n    content={\"detail\": \"Terlalu banyak permintaan\"},\n    headers={\n        \"Retry-After\": \"60\",\n        \"RateLimit-Limit\": \"100\",\n        \"RateLimit-Remaining\": \"0\",\n    },\n)"
      }
    ],
    "interactiveLab": `import time

jendela, batas = 60, 5
jejak: list[float] = []

def izinkan() -> bool:
    sekarang = time.time()
    jejak[:] = [t for t in jejak if t > sekarang - jendela]
    if len(jejak) >= batas:
        return False
    jejak.append(sekarang)
    return True

for i in range(8):
    print(f"permintaan {i+1}: {'DIIZINKAN' if izinkan() else 'DITOLAK 429'}")`,
    "quiz": [
      {
        "question": "Apa kelemahan algoritma fixed window untuk rate limiting?",
        "options": [
          "Ia memerlukan terlalu banyak memori",
          "Pada pergantian jendela, klien bisa mengirim dua kali batas dalam waktu sangat singkat karena penghitung direset mendadak",
          "Ia tidak bisa dipakai bersama Redis",
          "Ia hanya bekerja untuk permintaan GET"
        ],
        "answer": 1,
        "explanation": "Dengan batas 100 per menit, klien dapat mengirim 100 permintaan di detik terakhir jendela dan 100 lagi di detik pertama jendela berikutnya — 200 permintaan dalam hitungan detik. Sliding window menghindarinya dengan selalu menghitung permintaan dalam rentang waktu yang bergerak."
      },
      {
        "question": "Kapan header X-Forwarded-For boleh dipercaya untuk menentukan IP klien?",
        "options": [
          "Selalu, karena header ini bagian dari standar HTTP",
          "Hanya bila ada reverse proxy tepercaya di depan yang menimpa nilainya, dan aplikasi tidak bisa dijangkau langsung dari internet",
          "Hanya pada permintaan HTTPS",
          "Tidak pernah, header ini harus selalu diabaikan"
        ],
        "answer": 1,
        "explanation": "Klien bisa mengirim header ini dengan nilai apa pun. Bila aplikasi terjangkau langsung, penyerang cukup mengacak nilainya untuk melewati seluruh pembatasan. Header ini baru bermakna ketika proxy tepercaya menimpanya dengan alamat sumber koneksi yang sebenarnya."
      }
    ]
  },
  {
    "id": 19,
    "title": "19. Background Tasks & Asynchronous Workers",
    "category": "Advanced & Deploy",
    "videoId": "4HxjBvZMAg8",
    "duration": "22:00",
    "description": "Menjalankan tugas asynchronous latar belakang (kirim email, pemrosesan media) tanpa memblokir respons HTTP client.",
    "keyTakeaways": [
      "Menggunakan kelas `BackgroundTasks` bawaan FastAPI",
      "Respons HTTP dikembalikan seketika sementara tugas diproses di latar belakang",
      "Sangat efisien untuk pengiriman email verifikasi"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>⚡ Non-Blocking Background Tasks</h3>
                <p>Meningkatkan latensi respons server dengan menyerahkan pemrosesan berat ke antrean tugas latar belakang (*background queue*).</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "BackgroundTasks Usage",
        "code": "from fastapi import BackgroundTasks\ndef send_email(email: str): pass\n\n@app.post('/email')\ndef email_route(bg: BackgroundTasks):\n    bg.add_task(send_email, 'user@test.com')\n    return {'status': 'queued'}"
      }
    ],
    "interactiveLab": `from fastapi import FastAPI, BackgroundTasks

app = FastAPI()

def send_log(msg: str):
    print(f"Log: {msg}")

@app.post("/log")
def log_route(msg: str, bg: BackgroundTasks):
    bg.add_task(send_log, msg)
    return {"status": "queued"}`,
    "quiz": [
      {
        "question": "Kapan tugas di dalam BackgroundTasks.add_task() akan dieksekusi oleh FastAPI?",
        "options": [
          "Sesaat setelah respons HTTP berhasil dikirimkan ke client",
          "Sebelum request diterima",
          "Kemarin",
          "Hanya saat komputer di-restart"
        ],
        "answer": 0,
        "explanation": "FastAPI akan langsung mengirimkan respons HTTP ke client terlebih dahulu, lalu segera mengeksekusi tugas latar belakang tersebut."
      },
      {
        "question": "Metode manakah dari objek BackgroundTasks yang digunakan untuk menambahkan fungsi tugas baru ke antrean?",
        "options": [
          "add_task(func, arg1, arg2)",
          "push_job()",
          "dispatch()",
          "run_background()"
        ],
        "answer": 0,
        "explanation": "add_task() mendaftarkan fungsi beserta argumennya untuk dijalankan di background."
      },
      {
        "question": "Kapan sebaiknya kita menggunakan Celery/Redis daripada BackgroundTasks sederhana bawaan FastAPI?",
        "options": [
          "Ketika tugas membutuhkan antrean terdistribusi yang sangat berat, pemrosesan bertahap berulang (cron), dan retry mechanism yang kompleks",
          "Saat membuat rute GET sederhana",
          "Saat menampilkan gambar HTML",
          "Tidak ada bedanya"
        ],
        "answer": 0,
        "explanation": "Celery/Redis digunakan untuk task queue terdistribusi skala besar dengan retries dan scheduling."
      }
    ]
  },
  {
    "id": 20,
    "title": "20. Celery, Redis Queue & Pekerjaan Latar Belakang",
    "category": "Advanced & Deploy",
    "videoId": null,
    "duration": "18:15",
    "description": "Memindahkan pekerjaan berat ke luar siklus permintaan: kapan BackgroundTasks cukup, kapan butuh Celery, penjadwalan berkala, dan penanganan kegagalan.",
    "keyTakeaways": [
      "BackgroundTasks berjalan di proses yang sama — hilang bila proses mati",
      "Celery memberi ketahanan, retry, penjadwalan, dan pekerja yang terpisah",
      "Task Celery WAJIB idempoten karena bisa dijalankan lebih dari sekali",
      "Jangan pernah mengirim objek besar sebagai argumen task — kirim ID saja"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>⚖️ BackgroundTasks vs Celery</h3>
                <table class="tech-table">
                    <thead><tr><th></th><th>BackgroundTasks</th><th>Celery / RQ / ARQ</th></tr></thead>
                    <tbody>
                        <tr><td>Tempat berjalan</td><td>Proses web yang sama</td><td>Proses pekerja terpisah</td></tr>
                        <tr><td>Selamat bila proses mati?</td><td><strong>Tidak</strong></td><td>Ya</td></tr>
                        <tr><td>Retry otomatis</td><td>Tidak</td><td>Ya</td></tr>
                        <tr><td>Penjadwalan berkala</td><td>Tidak</td><td>Ya</td></tr>
                        <tr><td>Penskalaan terpisah</td><td>Tidak</td><td>Ya</td></tr>
                        <tr><td>Pemantauan</td><td>Tidak ada</td><td>Ada</td></tr>
                        <tr><td>Kerumitan</td><td>Nol</td><td>Perlu broker &amp; pekerja</td></tr>
                    </tbody>
                </table>
                <div class="callout callout-info">
                    <strong>💡 Panduan memilih</strong>
                    <p>Pakai <strong>BackgroundTasks</strong> untuk pekerjaan singkat yang boleh gagal diam-diam: mencatat audit, membersihkan berkas sementara, mengirim event analitik. Pakai <strong>Celery</strong> begitu pekerjaan itu <em>tidak boleh hilang</em> — email verifikasi, pembuatan invoice, pemrosesan pembayaran, pembuatan laporan.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🚫 Jebakan BackgroundTasks</h3>
                <div class="code-container">
                    <pre><code>@app.post("/daftar")
async def daftar(data: PenggunaBaru, tugas: BackgroundTasks):
    pengguna = await simpan(data)
    tugas.add_task(kirim_email_verifikasi, pengguna.email)   # ⚠️
    return {"id": pengguna.id}

# Bila pod di-restart, di-scale down, atau crash tepat setelah
# respons terkirim, email itu TIDAK PERNAH dikirim -- dan tidak ada
# jejak apa pun bahwa ia gagal. Pengguna tidak bisa masuk.</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>⚙️ Menyiapkan Celery</h3>
                <div class="code-container">
                    <div class="code-header"><span>celery_app.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>from celery import Celery

celery = Celery(
    "aplikasi",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
)

celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    timezone="Asia/Jakarta",

    # Baru di-ACK SETELAH selesai, bukan saat diterima.
    # Bila pekerja mati di tengah, task dikerjakan pekerja lain.
    task_acks_late=True,
    task_reject_on_worker_lost=True,

    # Ambil satu per satu -- penting untuk task yang durasinya beragam,
    # supaya tidak ada pekerja yang menimbun task lalu menganggur.
    worker_prefetch_multiplier=1,

    task_time_limit=300,        # dibunuh paksa
    task_soft_time_limit=270,   # exception dilempar dulu agar bisa bersih-bersih
    result_expires=3600,
)</code></pre>
                </div>
                <div class="callout callout-warning">
                    <strong>⚠️ <code>task_acks_late=True</code> mengubah jaminan pengiriman</strong>
                    <p>Dengan pengaturan bawaan, task di-ACK begitu diterima pekerja — bila pekerja mati sedetik kemudian, task itu <strong>hilang</strong>. Dengan <code>acks_late</code>, ACK baru dikirim setelah task selesai, sehingga task yang terputus akan dikerjakan ulang. Konsekuensinya: jaminan berubah menjadi <em>at-least-once</em>, dan <strong>task Anda wajib idempoten</strong>.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>📝 Menulis Task</h3>
                <div class="code-container">
                    <div class="code-header"><span>tasks.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>@celery.task(
    bind=True,
    autoretry_for=(httpx.HTTPError, ConnectionError),
    retry_backoff=True,        # 1s, 2s, 4s, 8s...
    retry_backoff_max=600,
    retry_jitter=True,         # sebar agar tidak serempak
    max_retries=5,
)
def kirim_email_verifikasi(self, pengguna_id: int):
    with sesi_db() as db:
        pengguna = db.get(Pengguna, pengguna_id)
        if pengguna is None:
            return "pengguna sudah dihapus"      # jangan retry
        if pengguna.email_terkirim_pada:
            return "sudah pernah dikirim"        # ← IDEMPOTEN

        layanan_email.kirim(pengguna.email, buat_token(pengguna))
        pengguna.email_terkirim_pada = datetime.now(timezone.utc)
        db.commit()
    return "terkirim"</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 Jangan kirim objek besar sebagai argumen</strong>
                    <div class="code-container">
                        <pre><code># ❌ Seluruh objek diserialisasi ke broker.
#    Datanya juga sudah basi saat task akhirnya dijalankan.
proses_pesanan.delay(objek_pesanan)

# ✅ Kirim ID saja, ambil data terbaru di dalam task.
proses_pesanan.delay(pesanan_id)</code></pre>
                    </div>
                    <p>Argumen task disimpan di broker sebagai JSON. Objek besar membebani Redis, memperlambat antrean, dan yang terpenting: data yang dikirim adalah potret saat task <em>dibuat</em>, bukan saat ia <em>dijalankan</em> — yang bisa berselang beberapa menit.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🔗 Memanggil dari FastAPI</h3>
                <div class="code-container">
                    <pre><code>@app.post("/daftar", status_code=202)
async def daftar(data: PenggunaBaru, db: SesiDB):
    pengguna = await simpan(db, data)

    hasil = kirim_email_verifikasi.delay(pengguna.id)

    return {
        "id": pengguna.id,
        "task_id": hasil.id,       # klien bisa memantau statusnya
    }

@app.get("/task/{task_id}")
async def status_task(task_id: str):
    hasil = celery.AsyncResult(task_id)
    return {
        "status": hasil.status,     # PENDING, STARTED, SUCCESS, FAILURE, RETRY
        "hasil": hasil.result if hasil.ready() else None,
    }</code></pre>
                </div>
                <div class="callout callout-warning">
                    <strong>⚠️ Jangan pernah memanggil <code>.get()</code> di dalam endpoint</strong>
                    <p><code>hasil.get()</code> memblokir sampai task selesai. Melakukannya di dalam endpoint menghapus seluruh manfaat pemrosesan asinkron — permintaan HTTP kembali menunggu, dan worker web Anda tertahan. Kembalikan <code>202 Accepted</code> beserta <code>task_id</code>, lalu biarkan klien memeriksa statusnya.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>⏰ Penjadwalan Berkala</h3>
                <div class="code-container">
                    <pre><code>from celery.schedules import crontab

celery.conf.beat_schedule = {
    "bersihkan-sesi": {
        "task": "tasks.bersihkan_sesi_kedaluwarsa",
        "schedule": crontab(hour=3, minute=0),
    },
    "laporan-harian": {
        "task": "tasks.kirim_laporan_harian",
        "schedule": crontab(hour=7, minute=0, day_of_week="1-5"),
    },
    "sinkron-stok": {
        "task": "tasks.sinkron_stok",
        "schedule": 300.0,        # tiap 5 menit
    },
}</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 Hanya boleh ada SATU proses beat</strong>
                    <p>Celery Beat adalah penjadwal. Menjalankan dua proses beat berarti setiap tugas terjadwal dieksekusi <strong>dua kali</strong> — laporan terkirim ganda, tagihan dibuat dua kali. Di Kubernetes, jalankan beat sebagai Deployment dengan <code>replicas: 1</code>, atau gunakan penjadwal yang mendukung penguncian terdistribusi.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🧵 Alternatif yang Lebih Ringan: ARQ</h3>
                <div class="code-container">
                    <pre><code># ARQ dibangun untuk asyncio, jauh lebih sederhana daripada Celery
from arq import create_pool
from arq.connections import RedisSettings

async def kirim_email(ctx, pengguna_id: int):
    ...

class WorkerSettings:
    functions = [kirim_email]
    redis_settings = RedisSettings(host="localhost")
    max_tries = 5

# Dari FastAPI:
await app.state.antrian.enqueue_job("kirim_email", pengguna_id)</code></pre>
                </div>
                <div class="callout callout-info">
                    <strong>💡 Kapan memilih ARQ</strong>
                    <p>Celery berakar pada kode sinkron dan dukungan asyncio-nya terasa ditempelkan belakangan. Bila seluruh aplikasi Anda sudah async dan kebutuhannya sederhana, <strong>ARQ</strong> memberi integrasi asyncio yang jauh lebih alami dengan permukaan konfigurasi yang jauh lebih kecil. Celery tetap unggul untuk alur kerja rumit: chain, group, chord, dan routing antrean berjenjang.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>📊 Yang Harus Dipantau</h3>
                <ul>
                    <li><strong>Panjang antrean.</strong> Naik terus berarti pekerja tidak cukup — beri alert pada ambang tertentu.</li>
                    <li><strong>Lama menunggu di antrean.</strong> Selisih antara task dibuat dan mulai dikerjakan.</li>
                    <li><strong>Tingkat kegagalan per jenis task.</strong> Lonjakan menandakan dependensi bermasalah.</li>
                    <li><strong>Task yang mati mendadak</strong> — biasanya karena OOM atau melewati batas waktu.</li>
                    <li><strong>Antrean surat mati.</strong> Task yang gagal melewati batas retry harus masuk ke sini untuk diperiksa manusia, bukan diulang selamanya.</li>
                </ul>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "Task Idempoten dengan Retry",
        "code": "@celery.task(bind=True, autoretry_for=(ConnectionError,),\n             retry_backoff=True, retry_jitter=True, max_retries=5)\ndef kirim_email(self, pengguna_id: int):\n    with sesi_db() as db:\n        p = db.get(Pengguna, pengguna_id)\n        if p.email_terkirim_pada:\n            return \"sudah pernah dikirim\"\n        layanan_email.kirim(p.email)\n        p.email_terkirim_pada = datetime.now(timezone.utc)\n        db.commit()"
      }
    ],
    "interactiveLab": `from datetime import datetime

terkirim: dict[int, datetime] = {}

def kirim_email(pengguna_id: int) -> str:
    # Penjaga idempotensi
    if pengguna_id in terkirim:
        return f"dilewati (sudah dikirim {terkirim[pengguna_id]:%H:%M:%S})"
    terkirim[pengguna_id] = datetime.now()
    return "email terkirim"

print("percobaan 1:", kirim_email(55))
print("percobaan 2:", kirim_email(55))   # task diulang setelah pekerja mati
print("pengguna lain:", kirim_email(71))`,
    "quiz": [
      {
        "question": "Mengapa BackgroundTasks tidak cocok untuk mengirim email verifikasi pendaftaran?",
        "options": [
          "Karena BackgroundTasks tidak mendukung operasi jaringan",
          "Karena ia berjalan di proses web yang sama, sehingga tugas hilang tanpa jejak bila pod di-restart atau crash setelah respons terkirim",
          "Karena BackgroundTasks hanya boleh dipakai untuk endpoint GET",
          "Karena BackgroundTasks selalu berjalan dua kali"
        ],
        "answer": 1,
        "explanation": "BackgroundTasks tidak dipersistensikan ke mana pun. Bila proses berakhir sebelum tugas selesai, tidak ada mekanisme yang mengulangnya dan tidak ada catatan bahwa ia gagal. Untuk pekerjaan yang tidak boleh hilang, gunakan antrean tugas dengan broker yang durabel."
      },
      {
        "question": "Apa konsekuensi mengaktifkan task_acks_late=True di Celery?",
        "options": [
          "Task menjadi berjalan lebih cepat",
          "Jaminan berubah menjadi at-least-once karena task yang terputus akan dikerjakan ulang, sehingga task wajib dibuat idempoten",
          "Task tidak akan pernah diulang",
          "Celery berhenti memerlukan broker"
        ],
        "answer": 1,
        "explanation": "Dengan acks_late, konfirmasi baru dikirim setelah task selesai. Ini melindungi dari kehilangan task ketika pekerja mati, tetapi berarti sebuah task yang sudah menyelesaikan efek sampingnya lalu terputus sebelum ACK akan dijalankan lagi oleh pekerja lain."
      }
    ]
  },
  {
    "id": 21,
    "title": "21. WebSocket & Komunikasi Real-time",
    "category": "Advanced & Deploy",
    "videoId": null,
    "duration": "17:35",
    "description": "Membangun fitur real-time seperti chat dan notifikasi dengan WebSocket, mengelola koneksi aktif, serta menyiarkan pesan lintas worker memakai Redis Pub/Sub.",
    "keyTakeaways": [
      "WebSocket adalah koneksi dua arah yang tetap terbuka, berbeda dari HTTP request-response",
      "ConnectionManager untuk melacak koneksi aktif dan menyiarkan pesan",
      "Autentikasi WebSocket tidak bisa memakai header Authorization biasa",
      "Dengan banyak worker, siaran WAJIB lewat Redis Pub/Sub"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📌 Kapan Memakai WebSocket</h3>
                <table class="tech-table">
                    <thead><tr><th>Kebutuhan</th><th>Pilihan yang tepat</th></tr></thead>
                    <tbody>
                        <tr><td>Notifikasi satu arah dari server</td><td><strong>Server-Sent Events (SSE)</strong> — lebih sederhana, otomatis menyambung ulang</td></tr>
                        <tr><td>Chat, kolaborasi, game</td><td><strong>WebSocket</strong> — dua arah</td></tr>
                        <tr><td>Pembaruan tiap 30 detik atau lebih jarang</td><td><strong>Polling biasa</strong> — jangan berlebihan</td></tr>
                        <tr><td>Unggah/unduh berkas besar</td><td><strong>HTTP biasa</strong></td></tr>
                    </tbody>
                </table>
                <div class="callout callout-info">
                    <strong>💡 Jangan langsung melompat ke WebSocket</strong>
                    <p>WebSocket membawa beban nyata: koneksi berumur panjang mempersulit load balancing, rilis bergulir memutus semua koneksi, dan Anda harus menangani penyambungan ulang sendiri. Bila arah datanya hanya server ke klien, <strong>SSE hampir selalu pilihan yang lebih baik</strong> — ia berjalan di atas HTTP biasa dan peramban menanganinya secara otomatis.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>💻 WebSocket Dasar</h3>
                <div class="code-container">
                    <div class="code-header"><span>main.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

@app.websocket("/ws/{ruangan}")
async def endpoint_ws(websocket: WebSocket, ruangan: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"[{ruangan}] {data}")
    except WebSocketDisconnect:
        print(f"klien keluar dari ruangan {ruangan}")</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>🗂️ Connection Manager</h3>
                <div class="code-container">
                    <div class="code-header"><span>manager.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>from collections import defaultdict
from fastapi import WebSocket

class PengelolaKoneksi:
    def __init__(self):
        self.aktif: dict[str, set[WebSocket]] = defaultdict(set)

    async def sambung(self, ws: WebSocket, ruangan: str):
        await ws.accept()
        self.aktif[ruangan].add(ws)

    def putus(self, ws: WebSocket, ruangan: str):
        self.aktif[ruangan].discard(ws)
        if not self.aktif[ruangan]:
            del self.aktif[ruangan]

    async def siarkan(self, pesan: dict, ruangan: str):
        mati = []
        for ws in self.aktif[ruangan]:
            try:
                await ws.send_json(pesan)
            except Exception:
                mati.append(ws)          # koneksi sudah putus
        for ws in mati:
            self.putus(ws, ruangan)

pengelola = PengelolaKoneksi()</code></pre>
                </div>
                <div class="callout callout-warning">
                    <strong>⚠️ Bersihkan koneksi mati saat menyiarkan</strong>
                    <p>Koneksi bisa putus tanpa memicu <code>WebSocketDisconnect</code> — misalnya ketika klien kehilangan jaringan secara tiba-tiba. Bila set koneksi tidak pernah dibersihkan, ia terus tumbuh dan setiap siaran membuang waktu mencoba mengirim ke soket yang sudah mati. Kumpulkan yang gagal saat menyiarkan lalu buang, seperti pada kode di atas.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🔐 Autentikasi WebSocket</h3>
                <div class="callout callout-danger">
                    <strong>🚫 Peramban tidak bisa mengirim header Authorization pada WebSocket</strong>
                    <p>API <code>WebSocket</code> di peramban tidak menyediakan cara menambahkan header kustom. Karena itu pola <code>Authorization: Bearer …</code> tidak bisa dipakai langsung.</p>
                </div>
                <div class="code-container">
                    <div class="code-header"><span>Tiga pendekatan</span></div>
                    <pre><code># 1. Token lewat query parameter -- sederhana, TAPI token bisa
#    tercatat di log akses proxy. Pakai token berumur sangat pendek.
@app.websocket("/ws")
async def ws(websocket: WebSocket, token: str = Query(...)):
    try:
        pengguna = verifikasi_token(token)
    except InvalidToken:
        await websocket.close(code=1008)   # policy violation
        return
    await websocket.accept()

# 2. Cookie HttpOnly -- paling aman untuk aplikasi web,
#    karena cookie ikut terkirim otomatis saat handshake.
@app.websocket("/ws")
async def ws(websocket: WebSocket):
    sesi = websocket.cookies.get("sesi")
    ...

# 3. Autentikasi pesan pertama setelah koneksi terbuka.
@app.websocket("/ws")
async def ws(websocket: WebSocket):
    await websocket.accept()
    auth = await asyncio.wait_for(websocket.receive_json(), timeout=5.0)
    pengguna = verifikasi_token(auth["token"])</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>🔀 Masalah Besar: Banyak Worker</h3>
                <div class="code-container">
                    <pre><code>uvicorn main:app --workers 4

Worker 1: [klien A, klien B]
Worker 2: [klien C]
Worker 3: [klien D, klien E]
Worker 4: []

Klien A mengirim pesan ke Worker 1.
pengelola.siarkan() hanya menjangkau klien B.
❌ Klien C, D, dan E tidak pernah menerimanya.</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 Dictionary di dalam memori tidak dibagi antar proses</strong>
                    <p>Setiap worker uvicorn adalah proses terpisah dengan memorinya sendiri. Ini bug yang sangat sering terjadi: fitur chat bekerja sempurna saat pengembangan dengan satu worker, lalu rusak begitu di-deploy ke produksi dengan banyak worker atau banyak pod.</p>
                </div>
                <div class="code-container">
                    <div class="code-header"><span>Solusi: Redis Pub/Sub sebagai jembatan</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>import asyncio, json
import redis.asyncio as redis

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.redis = redis.from_url("redis://localhost:6379")
    tugas = asyncio.create_task(dengarkan_redis(app))
    yield
    tugas.cancel()
    await app.state.redis.aclose()

async def dengarkan_redis(app: FastAPI):
    psub = app.state.redis.pubsub()
    await psub.psubscribe("ruangan:*")
    async for pesan in psub.listen():
        if pesan["type"] != "pmessage":
            continue
        ruangan = pesan["channel"].decode().split(":", 1)[1]
        # Kirim ke klien yang terhubung ke worker INI saja
        await pengelola.siarkan(json.loads(pesan["data"]), ruangan)

@app.websocket("/ws/{ruangan}")
async def ws(websocket: WebSocket, ruangan: str):
    await pengelola.sambung(websocket, ruangan)
    try:
        while True:
            data = await websocket.receive_json()
            # Terbitkan ke Redis -- SEMUA worker akan menerimanya
            await app.state.redis.publish(f"ruangan:{ruangan}", json.dumps(data))
    except WebSocketDisconnect:
        pengelola.putus(websocket, ruangan)</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>📡 Server-Sent Events sebagai Alternatif</h3>
                <div class="code-container">
                    <div class="code-header"><span>sse.py</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>from fastapi.responses import StreamingResponse

async def aliran_notifikasi(pengguna_id: int):
    psub = redis_klien.pubsub()
    await psub.subscribe(f"notif:{pengguna_id}")
    try:
        async for pesan in psub.listen():
            if pesan["type"] == "message":
                yield f"data: {pesan['data'].decode()}\\n\\n"
    finally:
        await psub.unsubscribe()

@app.get("/notifikasi")
async def notifikasi(pengguna_id: int):
    return StreamingResponse(
        aliran_notifikasi(pengguna_id),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )</code></pre>
                </div>
                <div class="callout callout-info">
                    <strong>💡 Keunggulan SSE yang sering diabaikan</strong>
                    <p>Peramban <strong>otomatis menyambung ulang</strong> SSE yang terputus, sesuatu yang harus Anda tulis sendiri untuk WebSocket. SSE juga berjalan di atas HTTP biasa sehingga bekerja mulus dengan proxy, CDN, dan autentikasi berbasis cookie. Header <code>X-Accel-Buffering: no</code> penting bila Anda memakai Nginx, karena tanpa itu Nginx akan menahan aliran di buffer.</p>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "WebSocket Endpoint",
        "code": "@app.websocket(\"/ws/{ruangan}\")\nasync def ws(websocket: WebSocket, ruangan: str):\n    await pengelola.sambung(websocket, ruangan)\n    try:\n        while True:\n            data = await websocket.receive_json()\n            await pengelola.siarkan(data, ruangan)\n    except WebSocketDisconnect:\n        pengelola.putus(websocket, ruangan)"
      }
    ],
    "interactiveLab": `from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()
aktif: set[WebSocket] = set()

@app.websocket("/ws")
async def ws(websocket: WebSocket):
    await websocket.accept()
    aktif.add(websocket)
    try:
        while True:
            teks = await websocket.receive_text()
            for k in list(aktif):
                await k.send_text(teks)
    except WebSocketDisconnect:
        aktif.discard(websocket)`,
    "quiz": [
      {
        "question": "Fitur chat WebSocket bekerja sempurna saat pengembangan tetapi rusak di produksi dengan 4 worker uvicorn. Apa penyebabnya?",
        "options": [
          "WebSocket tidak mendukung HTTPS",
          "Setiap worker adalah proses terpisah dengan memorinya sendiri, sehingga daftar koneksi aktif tidak dibagi dan siaran hanya menjangkau klien di worker yang sama",
          "Uvicorn membatasi jumlah koneksi WebSocket",
          "Kode perlu memakai lebih banyak thread"
        ],
        "answer": 1,
        "explanation": "Dictionary koneksi hanya hidup di memori satu proses. Klien yang terhubung ke worker lain tidak terlihat sama sekali. Solusinya adalah menyalurkan siaran lewat Redis Pub/Sub, sehingga setiap worker menerima pesan lalu meneruskannya ke klien yang terhubung padanya."
      },
      {
        "question": "Mengapa header Authorization tidak bisa dipakai untuk autentikasi WebSocket dari peramban?",
        "options": [
          "Karena WebSocket tidak mendukung autentikasi sama sekali",
          "Karena API WebSocket di peramban tidak menyediakan cara menambahkan header kustom pada handshake",
          "Karena header Authorization hanya berlaku untuk permintaan POST",
          "Karena FastAPI membuang seluruh header pada endpoint WebSocket"
        ],
        "answer": 1,
        "explanation": "Konstruktor WebSocket di peramban hanya menerima URL dan subprotokol, tanpa opsi header kustom. Alternatifnya adalah token lewat query parameter dengan umur sangat pendek, cookie HttpOnly yang ikut terkirim otomatis saat handshake, atau autentikasi lewat pesan pertama setelah koneksi terbuka."
      }
    ]
  },
  {
    "id": 22,
    "title": "22. Automated Testing dengan Pytest & TestClient",
    "category": "Advanced & Deploy",
    "videoId": "SO7m7nod0ts",
    "duration": "28:30",
    "description": "Menuliskan unit test & integration test untuk rute API menggunakan framework Pytest dan Starlette TestClient.",
    "keyTakeaways": [
      "Menggunakan `from fastapi.testclient import TestClient`",
      "Menjalankan pengujian otomatis in-memory tanpa memutar server Uvicorn nyata",
      "Memvalidasi status code HTTP & skema JSON response"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🧪 Pengujian Otomatis dengan Pytest</h3>
                <p>Memastikan setiap rute registrasi, login, dan CRUD data berjalan tanpa bug di lingkungan produksi melalui test suite terautomasi.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "Pytest TestClient Example",
        "code": "from fastapi.testclient import TestClient\nfrom main import app\nclient = TestClient(app)\n\ndef test_read_main():\n    res = client.get('/')\n    assert res.status_code == 200"
      }
    ],
    "interactiveLab": `from fastapi.testclient import TestClient
from fastapi import FastAPI

app = FastAPI()
@app.get("/ping")
def ping(): return {"ping": "pong"}

client = TestClient(app)
res = client.get("/ping")
print("Test Status Code:", res.status_code)`,
    "quiz": [
      {
        "question": "Kata kunci Python manakah yang digunakan di dalam fungsi test Pytest untuk memverifikasi nilai keluaran (misal: assert response.status_code == 200)?",
        "options": [
          "assert",
          "verify",
          "check",
          "expect"
        ],
        "answer": 0,
        "explanation": "Kata kunci bawaan Python assert digunakan oleh Pytest untuk menguji kebenaran kondisi klausa pengujian."
      },
      {
        "question": "Library manakah yang mendasari pembuatan TestClient di FastAPI?",
        "options": [
          "httpx",
          "requests",
          "urllib3",
          "curl"
        ],
        "answer": 0,
        "explanation": "TestClient FastAPI menggunakan HTTPX secara internal untuk mendukung pengujian HTTP synchronous & asynchronous."
      },
      {
        "question": "Apakah keuntungan menggunakan pytest fixtures saat menguji rute yang membutuhkan database?",
        "options": [
          "Menyediakan data uji terisolasi dan otomatis membersihkan (rollback/drop) DB setelah test selesai",
          "Membuat test lebih lambat",
          "Menghapus file python",
          "Tidak ada bedanya"
        ],
        "answer": 0,
        "explanation": "Fixtures memungkinkan penyiapan & pembersihan state database uji secara otomatis sebelum dan sesudah test."
      }
    ]
  },
  {
    "id": 23,
    "title": "23. File Storage & AWS S3 Integration",
    "category": "Advanced & Deploy",
    "videoId": "zCTJ3AdDym4",
    "duration": "26:40",
    "description": "Menyimpan gambar profil & berkas media postingan ke Object Storage AWS S3 menggunakan SDK Boto3.",
    "keyTakeaways": [
      "Menggunakan pustaka `boto3` untuk berkomunikasi dengan AWS S3",
      "Upload stream file langsung dari `UploadFile.file` ke S3 Bucket",
      "Menghasilkan URL publik untuk akses aset gambar"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>☁️ Cloud Object Storage dengan AWS S3</h3>
                <p>Memisahkan penyimpanan berkas media statis dari server lokal ke cloud storage terdistribusi AWS S3 demi skalabilitas tinggi.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "python",
        "title": "Boto3 S3 Upload",
        "code": "import boto3\ns3_client = boto3.client('s3')\ns3_client.upload_fileobj(file.file, 'my-bucket', file.filename)"
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>☁️ AWS S3 Storage Integration</h3>
      <div>Bucket Target: <code>s3://fastapi-blog-media/images/</code></div>
      <div>CDN Distribution: <code>https://cdn.mycompany.com/images/avatar.jpg</code></div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Pustaka SDK Python resmi apakah yang digunakan untuk mengunggah dan mengelola berkas di AWS S3?",
        "options": [
          "Boto3",
          "AwsPy",
          "S3Tools",
          "ConnectAWS"
        ],
        "answer": 0,
        "explanation": "Boto3 adalah AWS SDK resmi untuk bahasa pemrograman Python."
      },
      {
        "question": "Metode Boto3 manakah yang digunakan untuk mengunggah stream file Python langsung ke S3 Bucket?",
        "options": [
          "upload_fileobj()",
          "send_file()",
          "push_s3()",
          "write_bucket()"
        ],
        "answer": 0,
        "explanation": "upload_fileobj() menerima stream berkas (seperti UploadFile.file) dan mengunggahnya langsung ke S3."
      },
      {
        "question": "Mengapa menyimpan media berkas di AWS S3 jauh lebih disarankan dibanding menyimpan di folder server lokal saat produksi?",
        "options": [
          "Karena server lokal dapat kehabisan disk space dan media tidak hilang ketika server di-restart / di-scale out",
          "Karena AWS S3 gratis selamanya tanpa batas",
          "Karena AWS S3 mengubah file jadi video",
          "Tidak ada bedanya"
        ],
        "answer": 0,
        "explanation": "Object storage seperti S3 bersifat stateles, sangat berskala, dan mencegah disk penuh di server aplikasi."
      }
    ]
  },
  {
    "id": 24,
    "title": "24. Docker Containerization & Production Deployment",
    "category": "Advanced & Deploy",
    "videoId": "eqjngvKfabg",
    "duration": "35:00",
    "description": "Menyusun Dockerfile ter-optimasi, docker-compose.yml dengan PostgreSQL, dan deployment ke cloud server.",
    "keyTakeaways": [
      "Dockerfile berbasis `python:3.13-slim`",
      "Menjalankan Uvicorn worker process di container produksi",
      "Binds `--host 0.0.0.0` untuk aksesibilitas container"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🚢 Docker Containerization & Cloud Release</h3>
                <p>Membungkus aplikasi FastAPI beserta seluruh dependensinya ke dalam **Docker Container** untuk rilis cepat di lingkungan cloud produksi.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "dockerfile",
        "title": "Production Dockerfile",
        "code": "FROM python:3.13-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]"
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>🚀 Production Deployment Ready</h3>
      <div>Container Engine: <code>Docker (python:3.13-slim)</code></div>
      <div>Process Manager: <code>Uvicorn Worker Process</code></div>
      <div style={{ color: '#4ade80', marginTop: '6px' }}>Status: Live at https://api.mycompany.com 🎉</div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Mengapa parameter --host 0.0.0.0 WAJIB digunakan saat menjalankan Uvicorn di dalam Container Docker?",
        "options": [
          "Agar server Uvicorn mendengarkan seluruh antarmuka jaringan container sehingga dapat diakses dari luar container Docker",
          "Agar server tidak menggunakan memori",
          "Karena 127.0.0.1 adalah password",
          "Hanya formalitas"
        ],
        "answer": 0,
        "explanation": "--host 0.0.0.0 membuka port aplikasi ke seluruh interface jaringan container sehingga request dari luar dapat masuk."
      },
      {
        "question": "Perintah Docker CLI manakah yang digunakan untuk membangun Container Image dari file Dockerfile?",
        "options": [
          "docker build -t my-fastapi-app .",
          "docker run",
          "docker start",
          "docker create"
        ],
        "answer": 0,
        "explanation": "docker build membungkus skrip Dockerfile menjadi Container Image yang siap dijalankan."
      },
      {
        "question": "Apakah keuntungan utama menggunakan Docker Compose (docker-compose.yml) untuk aplikasi FastAPI?",
        "options": [
          "Memungkinkan menjalankan container FastAPI dan container PostgreSQL/Redis secara bersamaan dalam satu jaringan virtual dengan 1 perintah",
          "Menghapus database",
          "Mempercepat koneksi WiFi",
          "Hanya mitos"
        ],
        "answer": 0,
        "explanation": "Docker Compose mengorkestrasi banyak container (FastAPI, Database, Redis) secara harmonis dengan 1 file konfigurasi."
      }
    ]
  }
];

// App State Management
let currentModuleId = 1;
let completedModules = new Set();
let bookmarkedModules = new Set();
let currentFilterCategory = "ALL";
let searchQuery = "";

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  loadProgressFromStorage();
  renderSidebar();
  loadModule(currentModuleId);
  setupEventListeners();
});

// Load Progress from localStorage
function loadProgressFromStorage() {
  const savedCompleted = localStorage.getItem("fastapi_learning_completed");
  if (savedCompleted) {
    completedModules = new Set(JSON.parse(savedCompleted));
  }

  const savedBookmarks = localStorage.getItem("fastapi_learning_bookmarks");
  if (savedBookmarks) {
    bookmarkedModules = new Set(JSON.parse(savedBookmarks));
  }

  updateProgressBar();
}

// Save Progress to localStorage
function saveProgressToStorage() {
  localStorage.setItem("fastapi_learning_completed", JSON.stringify([...completedModules]));
  localStorage.setItem("fastapi_learning_bookmarks", JSON.stringify([...bookmarkedModules]));
  updateProgressBar();
}

// Update Top Progress Bar Widget
function updateProgressBar() {
  const total = modulesData.length;
  const count = completedModules.size;
  const percentage = Math.round((count / total) * 100);

  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  if (progressBar && progressText) {
    progressBar.style.width = `${percentage}%`;
    progressText.innerText = `${count} / ${total} Selesai (${percentage}%)`;
  }
}

// Reset All Progress
function resetAllProgress() {
  if (confirm("Apakah Anda yakin ingin mereset seluruh kemajuan belajar FastAPI Anda?")) {
    completedModules.clear();
    bookmarkedModules.clear();
    saveProgressToStorage();
    renderSidebar();
    loadModule(currentModuleId);
  }
}

// Event Listeners setup
function setupEventListeners() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderSidebar();
    });
  }
}

// Filter Category
function filterCategory(cat) {
  currentFilterCategory = cat;

  const filterButtons = document.querySelectorAll(".category-pill");
  filterButtons.forEach(btn => {
    if (btn.innerText.includes(cat) || (cat === "ALL" && btn.innerText === "Semua")) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  renderSidebar();
}

// Render Sidebar Chapter Cards
function renderSidebar() {
  const container = document.getElementById("chapterListContainer");
  if (!container) return;

  container.innerHTML = "";

  const filtered = modulesData.filter(m => {
    const matchesCat = (currentFilterCategory === "ALL") || (m.category === currentFilterCategory);
    const matchesSearch = searchQuery === "" || 
      m.title.toLowerCase().includes(searchQuery) || 
      m.description.toLowerCase().includes(searchQuery) ||
      m.category.toLowerCase().includes(searchQuery);

    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="padding: 16px; color: var(--text-muted); font-size: 0.85rem; text-align: center;">Tidak ada modul yang cocok dengan pencarian "${searchQuery}".</div>`;
    return;
  }

  filtered.forEach(mod => {
    const card = document.createElement("div");
    card.className = `chapter-card ${mod.id === currentModuleId ? "active" : ""}`;
    card.onclick = () => loadModule(mod.id);

    const isDone = completedModules.has(mod.id);
    const isBookmarked = bookmarkedModules.has(mod.id);

    card.innerHTML = `
      <div class="chapter-card-header">
        <span class="chapter-card-num">MODUL #${String(mod.id).padStart(2, '0')}</span>
        <span class="badge badge-teal" style="font-size:0.65rem;">${mod.category}</span>
      </div>
      <div class="chapter-card-title">${mod.title}</div>
      <div class="chapter-card-footer">
        <span>⏱️ ${mod.duration}</span>
        <div class="status-indicator">
          ${isBookmarked ? '<span>⭐</span>' : ''}
          <span class="status-dot ${isDone ? 'completed' : ''}"></span>
          <span>${isDone ? 'Selesai' : 'Belum'}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Load Selected Module Data
function loadModule(id) {
  currentModuleId = id;
  const mod = modulesData.find(m => m.id === id);
  if (!mod) return;

  renderSidebar();

  // Header Banner Info
  document.getElementById("chapterCategoryBadge").innerText = mod.category;
  document.getElementById("timestampText").innerText = mod.videoId;
  document.getElementById("chapterTitle").innerText = mod.title;
  document.getElementById("chapterDesc").innerText = mod.description;

  // Action Buttons state
  const bookmarkBtn = document.getElementById("bookmarkBtn");
  if (bookmarkBtn) {
    bookmarkBtn.innerText = bookmarkedModules.has(id) ? "⭐ Bookmarked" : "⭐ Bookmark";
    bookmarkBtn.className = `btn ${bookmarkedModules.has(id) ? "btn-primary" : "btn-secondary"}`;
  }

  const toggleCompletedBtn = document.getElementById("toggleCompletedBtn");
  if (toggleCompletedBtn) {
    toggleCompletedBtn.innerText = completedModules.has(id) ? "✅ Selesai (Klik Batal)" : "✅ Tandai Selesai";
  }

  // Render Article Body
  const articleBody = document.getElementById("articleBody");
  if (articleBody) {
    let keyTakeawaysHtml = mod.keyTakeaways ? `
      <div class="callout callout-tip" style="margin-bottom: 20px;">
        <strong>🎯 Poin-Poin Utama Modul Ini:</strong>
        <ul style="margin-top: 8px;">
          ${mod.keyTakeaways.map(k => `<li>${k.replace(/`([^`]+)`/g, (_, code) => "<code>" + code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</code>")}</li>`).join("")}
        </ul>
      </div>
    ` : "";

    articleBody.innerHTML = keyTakeawaysHtml + mod.fullArticle;
  }

  // Setup Video Tab
  kodelokaVideo(mod.videoId);

  // Setup Playground Tab
  loadPlaygroundSnippets(mod);

  // Setup Quiz Tab
  renderQuiz(mod);

  // Setup Notes Tab
  loadUserNote(id);

  // Footer Navigation Progress
  document.getElementById("currentFooterProgress").innerText = `Modul ${id} dari ${modulesData.length}`;

  // Scroll to top of main content
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle Current Module Bookmark
function toggleBookmark() {
  if (bookmarkedModules.has(currentModuleId)) {
    bookmarkedModules.delete(currentModuleId);
  } else {
    bookmarkedModules.add(currentModuleId);
  }
  saveProgressToStorage();
  loadModule(currentModuleId);
}

// Toggle Current Module Completed
function toggleCurrentCompleted() {
  if (completedModules.has(currentModuleId)) {
    completedModules.delete(currentModuleId);
  } else {
    completedModules.add(currentModuleId);
  }
  saveProgressToStorage();
  loadModule(currentModuleId);
}

// Tab Switching Mechanism
function switchTab(tabName) {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach(btn => {
    if (btn.getAttribute("data-tab") === tabName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  tabPanels.forEach(panel => {
    if (panel.id === `tab-${tabName}`) {
      panel.classList.add("active");
    } else {
      panel.classList.remove("active");
    }
  });
}

// Playground & Code Snippets Setup
function loadPlaygroundSnippets(mod) {
  const snippetGrid = document.getElementById("snippetButtonsGrid");
  const editor = document.getElementById("playgroundEditor");

  if (snippetGrid) {
    snippetGrid.innerHTML = "";
    if (mod.codeSnippets && mod.codeSnippets.length > 0) {
      mod.codeSnippets.forEach(snip => {
        const btn = document.createElement("button");
        btn.className = "btn-snippet";
        btn.innerText = snip.title;
        btn.onclick = () => {
          if (editor) editor.value = snip.code;
        };
        snippetGrid.appendChild(btn);
      });
    } else {
      snippetGrid.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted);">Tidak ada templat tambahan.</span>`;
    }
  }

  if (editor) {
    editor.value = mod.interactiveLab || `from fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/")\ndef root(): return {"message": "Hello FastAPI"}`;
  }

  runFastAPISimulation();
}

function loadSampleCode() {
  const mod = modulesData.find(m => m.id === currentModuleId);
  if (mod) loadPlaygroundSnippets(mod);
}

function clearPlayground() {
  const editor = document.getElementById("playgroundEditor");
  if (editor) editor.value = "";
}

// Run Simulated FastAPI Compilation & Render
function runFastAPISimulation() {
  const editor = document.getElementById("playgroundEditor");
  const uiPreview = document.getElementById("renderedUIPreview");
  const termOutput = document.getElementById("terminalOutput");

  if (!editor || !uiPreview || !termOutput) return;

  const code = editor.value;
  const timestamp = new Date().toLocaleTimeString();

  // Update Uvicorn Server Terminal Logs
  termOutput.innerHTML = `
    <div class="term-line term-info">[${timestamp}] INFO: 127.0.0.1:54321 - "GET /docs HTTP/1.1" 200 OK</div>
    <div class="term-line term-success">[${timestamp}] INFO: 127.0.0.1:54321 - "GET /api/v1/resource HTTP/1.1" 200 OK</div>
    <div class="term-line term-info">INFO: FastAPI Application Ready & Open API Schema Generated</div>
  `;

  // Render Simulated OpenAPI JSON Output
  try {
    uiPreview.innerHTML = `
      <div style="color: #a7f3d0; margin-bottom: 8px;">// HTTP 200 OK Response (JSON)</div>
      <pre style="background: transparent; padding: 0; font-size: 0.84rem;">{
  "status": "success",
  "openapi": "3.1.0",
  "info": {
    "title": "FastAPI Playlist Interactive Lab App",
    "version": "1.0.0"
  },
  "executed_code_preview": ${JSON.stringify(code.substring(0, 120))}...
}</pre>
    `;
  } catch (err) {
    uiPreview.innerHTML = `<div style="color: var(--error-color);">Error executing FastAPI snippet: ${err.message}</div>`;
  }
}

function clearTerminalOutput() {
  const termOutput = document.getElementById("terminalOutput");
  if (termOutput) termOutput.innerHTML = `<div class="term-line term-info">Uvicorn log cleared.</div>`;
}

// Render Quiz Questions
function renderQuiz(mod) {
  const quizContainer = document.getElementById("quizContainer");
  if (!quizContainer) return;

  if (!mod.quiz || mod.quiz.length === 0) {
    quizContainer.innerHTML = `<div style="padding: 20px; color: var(--text-muted);">Tidak ada soal quiz untuk modul ini.</div>`;
    return;
  }

  quizContainer.innerHTML = `
    <h3 style="font-size: 1.2rem; font-weight: 800; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
      🧪 Quiz Pemahaman Modul #${String(mod.id).padStart(2, '0')} (3 Soal Pemahaman)
    </h3>
  `;

  mod.quiz.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "quiz-card";

    const questionTitle = document.createElement("div");
    questionTitle.className = "quiz-question";
    questionTitle.innerText = `${index + 1}. ${q.question}`;
    card.appendChild(questionTitle);

    const optionsBox = document.createElement("div");
    optionsBox.className = "quiz-options";

    const explanationBox = document.createElement("div");
    explanationBox.className = "quiz-explanation";
    explanationBox.innerText = `💡 Penjelasan: ${q.explanation}`;

    q.options.forEach((optText, optIdx) => {
      const optBtn = document.createElement("div");
      optBtn.className = "quiz-option";
      optBtn.innerHTML = `<strong>${String.fromCharCode(65 + optIdx)}.</strong> ${optText}`;

      optBtn.onclick = () => {
        // Clear previous selections for this question
        const allOpts = optionsBox.querySelectorAll(".quiz-option");
        allOpts.forEach(o => o.className = "quiz-option");

        if (optIdx === q.answer) {
          optBtn.classList.add("correct");
        } else {
          optBtn.classList.add("incorrect");
          // highlight correct one
          allOpts[q.answer].classList.add("correct");
        }

        explanationBox.style.display = "block";
      };

      optionsBox.appendChild(optBtn);
    });

    card.appendChild(optionsBox);
    card.appendChild(explanationBox);
    quizContainer.appendChild(card);
  });
}

// Notes Section Storage
function loadUserNote(modId) {
  const notesTextarea = document.getElementById("notesTextarea");
  if (!notesTextarea) return;

  const savedNote = localStorage.getItem(`fastapi_note_${modId}`) || "";
  notesTextarea.value = savedNote;
}

function saveUserNote() {
  const notesTextarea = document.getElementById("notesTextarea");
  const saveStatus = document.getElementById("saveNotesStatus");
  if (!notesTextarea) return;

  localStorage.setItem(`fastapi_note_${currentModuleId}`, notesTextarea.value);

  if (saveStatus) {
    saveStatus.style.display = "inline";
    setTimeout(() => {
      saveStatus.style.display = "none";
    }, 2000);
  }
}

// Navigation Controls
function navigatePrev() {
  if (currentModuleId > 1) {
    loadModule(currentModuleId - 1);
  }
}

function navigateNext() {
  if (currentModuleId < modulesData.length) {
    loadModule(currentModuleId + 1);
  }
}

// Code Copy Helper
function copyCode(btn) {
  const codeBlock = btn.parentElement.nextElementSibling.querySelector("code");
  if (codeBlock) {
    navigator.clipboard.writeText(codeBlock.innerText);
    const origText = btn.innerText;
    btn.innerText = "Copied!";
    setTimeout(() => btn.innerText = origText, 1500);
  }
}

// Final Certification Exam Modal Engine
function openFinalExam() {
  const modal = document.getElementById("examModal");
  const body = document.getElementById("examModalBody");
  if (!modal || !body) return;

  // Generate 10 randomized exam questions from module quizzes
  const allQuizzes = [];
  modulesData.forEach(m => {
    if (m.quiz) {
      m.quiz.forEach(q => {
        allQuizzes.push({ ...q, modTitle: m.title });
      });
    }
  });

  const selectedQuestions = allQuizzes.sort(() => 0.5 - Math.random()).slice(0, 10);

  body.innerHTML = `
    <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--fastapi-emerald); margin-bottom: 12px;">
      🏆 Ujian Sertifikasi FastAPI Playlist Series Developer
    </h2>
    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 20px;">
      Jawab 10 soal di bawah ini dengan benar untuk menguji pemahaman komprehensif Anda tentang FastAPI, Jinja2 Templates, Pydantic v2, SQLAlchemy, JWT Auth, Pytest, & AWS S3. (Batas Kelulusan: 80%)
    </p>

    <div id="examQuestionsList" style="display: flex; flex-direction: column; gap: 20px;">
      ${selectedQuestions.map((q, idx) => `
        <div class="quiz-card">
          <div style="font-size:0.75rem; color:var(--fastapi-emerald); font-family:var(--font-mono);">${q.modTitle}</div>
          <div class="quiz-question">${idx + 1}. ${q.question}</div>
          <div class="quiz-options">
            ${q.options.map((opt, optIdx) => `
              <div class="quiz-option" onclick="selectExamAnswer(${idx}, ${optIdx}, this)">
                <strong>${String.fromCharCode(65 + optIdx)}.</strong> ${opt}
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>

    <div style="margin-top: 24px; text-align: right;">
      <button class="btn btn-primary" onclick="submitFinalExam(${JSON.stringify(selectedQuestions).replace(/"/g, '&quot;')})">
        🚀 Kirim Jawaban Ujian
      </button>
    </div>
  `;

  modal.classList.add("active");
}

let examUserAnswers = [];

function selectExamAnswer(qIdx, optIdx, element) {
  const parent = element.parentElement;
  parent.querySelectorAll(".quiz-option").forEach(el => el.classList.remove("selected"));
  element.classList.add("selected");
  examUserAnswers[qIdx] = optIdx;
}

function submitFinalExam(questions) {
  let score = 0;
  questions.forEach((q, idx) => {
    if (examUserAnswers[idx] === q.answer) {
      score++;
    }
  });

  const percentage = Math.round((score / questions.length) * 100);
  const isPassed = percentage >= 80;

  const body = document.getElementById("examModalBody");
  if (!body) return;

  body.innerHTML = `
    <div style="text-align: center; padding: 20px 0;">
      <div style="font-size: 3rem; margin-bottom: 12px;">${isPassed ? '🎉' : '❌'}</div>
      <h2 style="font-size: 1.8rem; font-weight: 900; color: ${isPassed ? 'var(--success-color)' : 'var(--error-color)'};">
        ${isPassed ? 'Selamat! Anda Lulus Ujian Sertifikasi FastAPI Playlist Series' : 'Maaf, Anda Belum Lulus'}
      </h2>
      <div style="font-size: 2.5rem; font-weight: 900; margin: 16px 0; color: #ffffff;">
        Skor Anda: ${percentage}% (${score} / ${questions.length} Benar)
      </div>
      <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 24px auto;">
        ${isPassed 
          ? 'Anda telah menguasai seluruh konsep FastAPI, Jinja2 Templates, Pydantic, SQLAlchemy 2.0, JWT Auth, Pytest, dan Docker dengan sangat baik.' 
          : 'Batas nilai kelulusan adalah 80%. Pelajari kembali modul-modul yang belum Anda pahami dan coba ujian kembali.'}
      </p>

      <div style="display: flex; justify-content: center; gap: 12px;">
        <button class="btn btn-secondary" onclick="openFinalExam()">🔄 Coba Ulang Ujian</button>
        <button class="btn btn-primary" onclick="closeFinalExam()">Tutup Window</button>
      </div>
    </div>
  `;
}

function closeFinalExam() {
  const modal = document.getElementById("examModal");
  if (modal) modal.classList.remove("active");
}
