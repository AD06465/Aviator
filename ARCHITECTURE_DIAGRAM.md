# AVIATOR Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         AVIATOR APPLICATION                              │
│                     FlightDeck Task Automation                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                              │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Layout    │  │ OrderForm   │  │TaskMonitor  │  │TaskConfig   │   │
│  │ Component   │  │ Component   │  │ Component   │  │  Manager    │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
│         │                 │                 │                 │          │
│         └─────────────────┴─────────────────┴─────────────────┘          │
│                                     │                                    │
└─────────────────────────────────────┼────────────────────────────────────┘
                                      │
┌─────────────────────────────────────┼────────────────────────────────────┐
│                         STATE MANAGEMENT LAYER                           │
├─────────────────────────────────────┼────────────────────────────────────┤
│  ┌──────────────────────────────────▼─────────────────────────────────┐ │
│  │                       Context Providers                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │ │
│  │  │ TaskContext  │  │OrderContext  │  │ConfigContext │            │ │
│  │  │              │  │              │  │              │            │ │
│  │  │ • tasks      │  │ • order      │  │ • taskConfig │            │ │
│  │  │ • status     │  │ • userInfo   │  │ • mappings   │            │ │
│  │  │ • search     │  │ • env        │  │ • settings   │            │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘            │ │
│  └─────────┼──────────────────┼──────────────────┼────────────────────┘ │
│            │                  │                  │                      │
└────────────┼──────────────────┼──────────────────┼──────────────────────┘
             │                  │                  │
┌────────────┼──────────────────┼──────────────────┼──────────────────────┐
│                          BUSINESS LOGIC LAYER                            │
├────────────┼──────────────────┼──────────────────┼──────────────────────┤
│            │                  │                  │                      │
│  ┌─────────▼────────┐  ┌──────▼──────┐  ┌───────▼────────┐            │
│  │ TaskProcessor    │  │  Mandatory  │  │  Task Config   │            │
│  │                  │  │   Field     │  │    Manager     │            │
│  │ • Process tasks  │  │  Manager    │  │                │            │
│  │ • Priority logic │  │             │  │ • Mappings     │            │
│  │ • Retry logic    │  │ • Analyze   │  │ • Rules        │            │
│  │ • Delays         │  │ • Validate  │  │ • Defaults     │            │
│  └─────────┬────────┘  └──────┬──────┘  └───────┬────────┘            │
│            │                  │                  │                      │
└────────────┼──────────────────┼──────────────────┼──────────────────────┘
             │                  │                  │
┌────────────┼──────────────────┴──────────────────┼──────────────────────┐
│                          SERVICES LAYER                                  │
├────────────┼────────────────────────────────────────┼──────────────────┤
│            │                                        │                  │
│  ┌─────────▼─────────┐  ┌────────────────┐  ┌──────▼──────┐          │
│  │   FlightDeck      │  │    Logger      │  │   Config    │          │
│  │   API Service     │  │    Service     │  │   Service   │          │
│  │                   │  │                │  │             │          │
│  │ • searchTasks     │  │ • debug        │  │ • get/set   │          │
│  │ • getTaskDetails  │  │ • info         │  │ • persist   │          │
│  │ • completeTask    │  │ • warn         │  │ • validate  │          │
│  │ • retryTask       │  │ • error        │  │             │          │
│  │ • updateTask      │  │ • critical     │  │             │          │
│  │ • getWorkgroups   │  │ • export       │  │             │          │
│  └─────────┬─────────┘  └────────┬───────┘  └──────┬──────┘          │
│            │                     │                  │                  │
└────────────┼─────────────────────┼──────────────────┼──────────────────┘
             │                     │                  │
┌────────────┼─────────────────────┼──────────────────┼──────────────────┐
│                         INFRASTRUCTURE LAYER                             │
├────────────┼─────────────────────┼──────────────────┼──────────────────┤
│            │                     │                  │                  │
│  ┌─────────▼────────┐  ┌─────────▼────────┐  ┌──────▼───────┐        │
│  │   Error          │  │   Constants      │  │ Environment  │        │
│  │  Boundaries      │  │                  │  │   Config     │        │
│  │                  │  │ • TASK_NAMES     │  │              │        │
│  │ • Catch errors   │  │ • STATUSES       │  │ • API URLs   │        │
│  │ • Show fallback  │  │ • PRIORITIES     │  │ • Features   │        │
│  │ • Log errors     │  │ • DELAYS         │  │ • Settings   │        │
│  │ • Reset          │  │ • DEVICES        │  │              │        │
│  └──────────────────┘  └──────────────────┘  └──────────────┘        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐         ┌──────────────────┐                     │
│  │   FlightDeck     │◄────────┤  AVIATOR Backend │ (Optional)          │
│  │   REST API       │         │                  │                     │
│  │                  │         │  • Job Queue     │                     │
│  │ Test 1 / 2 / 4   │         │  • Database      │                     │
│  │                  │         │  • Auth Service  │                     │
│  └──────────────────┘         │  • Audit Logs    │                     │
│                               └──────────────────┘                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘


DATA FLOW EXAMPLE: Task Completion
═══════════════════════════════════════════════════════════════════════════

1. User Input
   └─> OrderForm Component
       └─> OrderContext.setCurrentOrder()

2. Start Processing
   └─> TaskProcessor.startProcessing()
       ├─> FlightDeckApiService.searchTasks()
       │   └─> HTTP Request to FlightDeck API
       │       └─> Returns tasks
       │
       ├─> TaskContext.setTasks()
       │   └─> Updates UI automatically
       │
       └─> For each task:
           ├─> Check if completable (TaskConfig)
           ├─> Get field values (MandatoryFieldManager)
           ├─> Log action (Logger)
           ├─> FlightDeckApiService.completeTask()
           │   └─> HTTP Request to FlightDeck API
           │
           ├─> On Success:
           │   ├─> Logger.info("Task completed")
           │   ├─> TaskContext.updateTask()
           │   └─> UI updates automatically
           │
           └─> On Error:
               ├─> ErrorBoundary catches
               ├─> Logger.error("Task failed", error)
               ├─> Show friendly error page
               └─> Offer retry/download logs


TESTING FLOW
═══════════════════════════════════════════════════════════════════════════

┌─────────────────┐
│  Vitest         │
│  Test Runner    │
└────────┬────────┘
         │
         ├─> Unit Tests
         │   ├─> Logger Service
         │   ├─> Config Service
         │   ├─> TaskProcessor
         │   └─> Utility Functions
         │
         ├─> Component Tests
         │   ├─> OrderForm
         │   ├─> TaskMonitor
         │   └─> TaskConfig
         │
         └─> Integration Tests
             ├─> Full flow testing
             └─> Context interactions


BACKEND ARCHITECTURE (Optional)
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                         Backend Server (Express)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  API Routes              Middleware             Services                │
│  ┌──────────┐           ┌──────────┐           ┌──────────┐           │
│  │ /auth    │──────────▶│  Auth    │──────────▶│  Auth    │           │
│  │ /tasks   │           │  Verify  │           │  Service │           │
│  │ /config  │           └──────────┘           └──────────┘           │
│  │ /logs    │           ┌──────────┐           ┌──────────┐           │
│  └──────────┘           │  Error   │           │  Task    │           │
│                         │  Handler │           │  Service │           │
│                         └──────────┘           └──────────┘           │
│                         ┌──────────┐           ┌──────────┐           │
│                         │  Logger  │           │  Config  │           │
│                         │          │           │  Service │           │
│                         └──────────┘           └──────────┘           │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                          Data Layer                                      │
│  ┌──────────┐           ┌──────────┐           ┌──────────┐           │
│  │Database  │           │  Redis   │           │  Prisma  │           │
│  │(Postgres)│           │  Queue   │           │   ORM    │           │
│  └──────────┘           └──────────┘           └──────────┘           │
└─────────────────────────────────────────────────────────────────────────┘


FOLDER STRUCTURE VISUALIZATION
═══════════════════════════════════════════════════════════════════════════

AVIATOR/
│
├── src/
│   ├── features/                    ← Feature-based organization
│   │   ├── orders/                  ← Order management
│   │   │   ├── components/
│   │   │   ├── context/            ← OrderContext
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   │
│   │   ├── tasks/                   ← Task processing
│   │   │   ├── components/
│   │   │   ├── context/            ← TaskContext
│   │   │   ├── processors/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   │
│   │   └── config/                  ← Configuration
│   │       ├── components/
│   │       ├── context/            ← ConfigContext
│   │       └── services/
│   │
│   ├── core/                        ← Core functionality
│   │   ├── constants/               ← All constants
│   │   ├── config/                  ← App configuration
│   │   └── providers/               ← Context providers
│   │
│   ├── services/                    ← Application services
│   │   ├── logging/                ← Logger
│   │   ├── api/                    ← API client
│   │   └── auth/                   ← Authentication
│   │
│   ├── shared/                      ← Shared resources
│   │   ├── components/             ← ErrorBoundary, etc.
│   │   ├── hooks/                  ← Reusable hooks
│   │   └── utils/                  ← Utilities
│   │
│   ├── test/                        ← Test utilities
│   │   ├── setup.ts
│   │   ├── utils.tsx
│   │   └── services/
│   │
│   ├── components/                  ← Existing components
│   ├── lib/                         ← Existing libraries
│   ├── types/                       ← Type definitions
│   └── app/                         ← Next.js app
│
├── backend/                         ← Backend API (optional)
│   ├── src/
│   │   ├── api/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
│
├── docs/                            ← Documentation
│   ├── ARCHITECTURE.md
│   ├── QUICKSTART.md
│   └── IMPROVEMENTS_COMPLETE.md
│
└── launch-aviator.bat               ← One-click launcher
```
