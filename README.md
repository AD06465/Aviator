# AVIATOR - FlightDeck Task Automation System

A comprehensive, enterprise-grade application for automating FlightDeck task completion and monitoring. AVIATOR streamlines workflow processing by intelligently handling task completion, retry logic, and real-time monitoring.

## 🚀 Features

### Core Functionality
- **Automated Task Processing**: Automatically completes ready and assigned tasks based on configurable rules
- **Enhanced Field Support**: Shows ALL editable fields for tasks, including Network Build Form and Engineering Solution fields
- **Intelligent Field Detection**: Automatically detects field types (text, dropdown, date, checkbox, number, textarea)
- **Smart Default Values**: Pre-populates fields with intelligent defaults including auto-generated CLLI codes
- **Intelligent Retry Logic**: Retries failed tasks with configurable retry limits and delays
- **Real-time Monitoring**: Continuous monitoring of task status with live updates
- **Environment Support**: Multi-environment support (Test 1, Test 2, Test 4)
- **Workgroup Integration**: Dynamic workgroup loading and selection

### Enhanced Field System
- **Universal Field Display**: Shows both mandatory AND optional editable fields
- **Network Build Form Support**: Handles fields like Rack Size, Device Mount Type, Backboard Size, Device Mount Provide By, ECN Port Other, ECN Device, Aisle(Rack), RMU, Device Mount Status, Lag Transport, Standard BIDI, Auto Select ECN Port, Device Elevation, Bay, Room, Fiber Source, Transport Bandwidth, Device Sub Type, Device Type
- **Device CLLI ARM Generation**: Automatically generates CLLI ARM format (DNVFCOQE##W) with random numbers
- **Engineering Solution Fields**: Supports Build Types, CCEA, Dedicated Options, WFMT Project Id, OSP Remarks, Constraints, Order Constraints, Procurement Request Type, Survey Category, Implementation Team, Building Access Qty, and more
- **Field Type Support**: Text inputs, dropdowns with options, date pickers, checkboxes, number inputs, and textareas
- **Smart Field Descriptions**: Context-aware help text for each field

### User Interface
- **Modern React/Next.js UI**: Professional, responsive interface built with Tailwind CSS
- **Real-time Dashboard**: Live status updates and progress tracking
- **Enhanced Task Configuration**: User-friendly interface to manage task completion rules and field mappings
- **Comprehensive Task Monitor**: Detailed task information with sorting and filtering
- **Dynamic Field Modal**: Interactive popup showing all relevant fields with pre-filled defaults

### Advanced Features
- **Field Mapping System**: Configure mandatory field values for different task types
- **Priority-based Processing**: Intelligent task completion order based on business logic
- **Delay Management**: Configurable delays between task processing to avoid system overload
- **Failed Task Handling**: Smart handling of failed tasks with retry mechanisms
- **Configuration Persistence**: Save and load custom task configurations

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **API Integration**: Axios for HTTP requests
- **State Management**: React hooks with local storage persistence
- **Type Safety**: Full TypeScript implementation

### Key Components
- **TaskProcessor**: Core automation engine
- **FlightDeckApiService**: API communication layer
- **Task Configuration Manager**: Rule management system
- **Real-time Monitor**: Live task status tracking

## 🔧 Configuration

### Environment Setup
The application supports multiple FlightDeck environments:
- **Test 1**: `https://workmate-svc-test1.rke-odc-test.corp.intranet`
- **Test 2**: `https://workmate-svc-test4.rke-odc-test.corp.intranet`  
- **Test 4**: `https://workmate-svc-test2.rke-odc-test.corp.intranet`

### Task Configuration
Configure which tasks can be completed automatically and which can be retried:

#### Default Completable Tasks
- Confirm/Schedule Activation
- Service Validate Field
- Service Validate - UNI (Tester)
- Service Validate Ethernet
- Send Completion Details
- Verify or Assign Appropriate Device
- LOA Designate Tid and Port
- LOA Verification

#### Default Retryable Tasks
- Get Details from MESH
- Create Uni in ASRI
- Activate UNI in ACT
- Update Uni in ASRI
- Activate Path in ACT

### Field Mapping Examples
- **Service Validate - UNI (Tester)**: `Demarc_Information*` → `Test`
- **LOA Designate Tid and Port**: 
  - `TID*` → Selected device from user input
  - `Port` → Port value from user input
  - `Demarc Location` → `TEST`

## 🔄 Processing Logic

### Task Completion Order
1. Confirm/Schedule Activation
2. Service Validate Field  
3. Service Validate - UNI (Tester)
4. Service Validate Ethernet
5. Send Completion Details

### Parallel Task Handling
- **Service Validate Field** completed before **Service Validate - UNI (Tester)**
- 15-minute delay between multiple **Service Validate - UNI (Tester)** tasks
- Smart ordering for **Service Validate - UNI (Tester)** and **Service Validate Ethernet**

### Retry Logic
- Maximum 3 retry attempts for failed tasks
- 5-minute wait between retries
- Automatic error reporting after final failure

## 📋 User Inputs

### Required Fields
- **Order Number**: Target order for processing
- **Product Name**: Product identifier
- **Itential Workflow Name**: Dropdown (Monarch Onnet, Monarch Offnet, Colorless)
- **Environment**: Test environment selection
- **UserName (CUID)**: User identifier for API authentication
- **FD WorkGroup**: Dynamic workgroup selection

### Optional Fields
- **Preferred Device**: Device selection with custom device addition
- **Preferred Port**: Port specification for device-based tasks

## 🔐 API Integration

### Authentication
All API calls include the `x-username` header with the user's CUID for authentication.

### Endpoints Used
1. **Task Search**: Advanced search for order-specific tasks
2. **Task Details**: Detailed task information retrieval
3. **Task Updates**: Field data population
4. **Task Actions**: Complete and retry operations
5. **Workgroup API**: Dynamic workgroup loading

### Error Handling
- Automatic retry on API failures
- Comprehensive error logging
- User-friendly error notifications
- Graceful degradation for network issues

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build
```bash
npm run build
npm start
```

## 📊 Monitoring & Analytics

### Real-time Dashboard
- Live task count tracking
- Completion progress visualization
- Failed task highlighting
- Processing status indicators

### Task Details
- Task creation and modification timestamps
- Status history tracking
- Error message display
- Source task ID correlation

## 🔧 Customization

### Field Mapping Configuration

#### ✨ Enhanced: Now Accepts Both Field Names AND Labels!
The system now automatically accepts **both** field names (technical identifiers) and labels (what you see in FlightDeck UI):

**✅ BOTH of these work:**
```json
{
  "taskFieldMappings": {
    "Network Build Form": {
      "autoselectECNPort": "No",         // ← Field "name" (technical)
      "Auto Select ECN Port": "No",      // ← Field "label" (FlightDeck UI)
      "ECN Device": "Router-X1",         // ← Field "label" 
      "deviceMountType": "Front Mount"   // ← Field "name"
    }
  }
}
```

**🎯 User-Friendly Approach:**
- Use whatever you see in the FlightDeck UI
- The system automatically maps labels to correct field names
- No more guessing technical field names!

#### Automatic Label-to-Name Mapping
The system includes intelligent mapping that:
1. **Tries direct field name match first**
2. **Falls back to label matching** (case-insensitive)
3. **Handles partial matches** for slight variations
4. **Logs the resolution** for transparency

#### Common Field Mappings (Both Formats Work)
| What You See in FlightDeck | Field Name | Example Value |
|---------------------------|------------|---------------|
| Auto Select ECN Port | `autoselectECNPort` | "No" |
| ECN Device | `ecnDevice` | "Router-X1" |
| Device Mount Type | `deviceMountType` | "Front Mount" |
| Rack Size | `rackSize` | "42U" |
| Device CLLI ARM | `deviceCLLIARM` | "DNVFCOQE76W" |

### Adding New Task Types
1. Update task configuration in the UI
2. Define field mappings for mandatory data
3. Configure completion or retry behavior
4. Test with sample orders

### Environment Configuration
Update environment URLs in the configuration files to support additional test environments or production systems.

### Custom Field Mappings
Use placeholder values in field mappings:
- `{{preferredDevice}}` - User-selected device
- `{{preferredPort}}` - User-specified port
- `{{workflowBasedValue}}` - Workflow-dependent values

## 🔍 Troubleshooting

### Common Issues
- **Authentication Errors**: Verify CUID and workgroup selection
- **Task Not Found**: Check order number format and environment
- **Processing Stuck**: Review task dependencies and priority order
- **Field Mapping Errors**: Validate mandatory field configurations

### Debug Mode
Enable detailed logging by checking browser developer tools console for API call details and error messages.

## 📝 License

Enterprise Software - Internal Use Only

## 🤝 Support

For technical support or feature requests, contact the development team or submit an issue through the internal ticketing system.

---

**AVIATOR** - Streamlining FlightDeck operations with intelligent automation.
