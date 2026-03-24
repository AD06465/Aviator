now we alreday tested create order number api (http://localhost:3000/test-create-order.html) help me to test below api to add psp on that order number 


Below is call to add Fabric Port product pacakge to generated order number , in below call 556181595 is order number generated in previos call 

and  below numbers we need to generate unique numbers each time and pass in beolow payload 

464259129, 352951848, 352951849



Request URL
http://swiftenv1/OrderPackage/ProductPackages/SaveProductKey
Request Method
POST
Status Code
200 OK
Remote Address
4.72.39.37:80
Referrer Policy
strict-origin-when-cross-origin



Payload : 


{
	"productViewModel": {
		"ProductInstanceId": 0,
		"ProductPackageId": 464259129,
		"TransactionId": 556181595,
		"ProductId": 160,
		"IsParentProduct": true,
		"Action": "Add",
		"RequestedDueDate": null,
		"RequestedDueDateTimeZone": null,
		"PriceInfoId": 0,
		"MarketId": 1057,
		"PcatVersion": "23-Mar-26",
		"GroupingType": null,
		"EffectiveBillDate": "1/1/0001 12:00:00 AM",
		"ProductName": "Fabric Port",
		"AccountNumber": 304254,
		"KenanBAN": "5-SCDKVVQ3",
		"InvoiceDisplayBAN": "304254",
		"LexmBAN": null,
		"PromotionCode": "NONE",
		"IsExistingProduct": "No",
		"ProductCategory": null,
		"BanSelect": false,
		"ProductAttributes": [
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "CPT",
				"AttributeDisplayValue": "CSP3",
				"AttributeValue": "CSP3",
				"PcatDefinition": {
					"Name": "CPT",
					"Label": "Pricing Tier",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "CSP3",
							"Value": "CSP3",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Flex",
				"AttributeDisplayValue": "CSP",
				"AttributeValue": "CSP",
				"PcatDefinition": {
					"Name": null,
					"Label": null,
					"Type": "List",
					"Optional": null,
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 0,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": null,
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "CSP",
							"Value": "CSP",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": null,
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Network Status",
				"AttributeDisplayValue": "On Net",
				"AttributeValue": "On Net",
				"PcatDefinition": {
					"Name": "Network Status",
					"Label": "Network Status",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "On Net",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "Off Net",
							"Value": "Off Net",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "<default> On Net",
							"Value": "On Net",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Port Bandwidth",
				"AttributeDisplayValue": "1 Gbps",
				"AttributeValue": "1000 Mbps",
				"PcatDefinition": {
					"Name": "Port Bandwidth",
					"Label": "Port Bandwidth",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "1 Gbps",
							"Value": "1000 Mbps",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "10 Gbps",
							"Value": "10000 Mbps",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "High Bandwidth",
				"AttributeDisplayValue": "No",
				"AttributeValue": "No",
				"PcatDefinition": {
					"Name": "High Bandwidth",
					"Label": "Full Port Speed",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "No",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> No",
							"Value": "No",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Bandwidth",
				"AttributeDisplayValue": "Not Applicable for On Net Locations",
				"AttributeValue": "Not Applicable for On Net Locations",
				"PcatDefinition": {
					"Name": "Bandwidth",
					"Label": "Bandwidth",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "Not Applicable for On Net Locations",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> Not Applicable for On Net Locations",
							"Value": "Not Applicable for On Net Locations",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Intent",
				"AttributeDisplayValue": "NaaS",
				"AttributeValue": "NaaS",
				"PcatDefinition": {
					"Name": "Intent",
					"Label": "Intent",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "NaaS",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "Ethernet",
							"Value": "Ethernet",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "<default> NaaS (IoD or EoD)",
							"Value": "NaaS",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "UNI Type",
				"AttributeDisplayValue": "Multiplexed",
				"AttributeValue": "Multiplexed",
				"PcatDefinition": {
					"Name": "UNI Type",
					"Label": "UNI Type",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "Multiplexed",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> Multiplexed",
							"Value": "Multiplexed",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "3rd Party Cross Connect",
				"AttributeDisplayValue": "No",
				"AttributeValue": "No",
				"PcatDefinition": {
					"Name": "3rd Party Cross Connect",
					"Label": "3rd Party Cross Connect",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "No",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> No",
							"Value": "No",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "Yes",
							"Value": "Yes",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Cloud Provider",
				"AttributeDisplayValue": "N/A",
				"AttributeValue": "N/A",
				"PcatDefinition": {
					"Name": "Cloud Provider",
					"Label": "Cloud Provider",
					"Type": "List",
					"Optional": "None",
					"DefaultValue": "N/A",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> N/A",
							"Value": "N/A",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Inside Wiring",
				"AttributeDisplayValue": "Standard Delivery - To the MPoE (Customer Provided)",
				"AttributeValue": "Standard Delivery - To the MPoE (Customer Provided)",
				"PcatDefinition": {
					"Name": "Inside Wiring",
					"Label": "Building Extension",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "Extended Delivery - To the Customer Suite (Lumen Provided)",
							"Value": "Extended Delivery - To the Customer Suite (Level 3 Provided)",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "Standard Delivery - To the MPoE (Customer Provided)",
							"Value": "Standard Delivery - To the MPoE (Customer Provided)",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "IP Pop",
				"AttributeDisplayValue": "DENVER",
				"AttributeValue": "DENVER",
				"PcatDefinition": {
					"Name": "IP Pop",
					"Label": "IP Pop",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "DENVER",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "ALBANY",
							"Value": "ALBANY",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ALBUQUERQUE",
							"Value": "ALBUQUERQUE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ASHBURN",
							"Value": "ASHBURN",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ATLANTA",
							"Value": "ATLANTA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "AUSTIN",
							"Value": "AUSTIN",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BAKERSFIELD",
							"Value": "BAKERSFIELD",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BALTIMORE",
							"Value": "BALTIMORE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BATON ROUGE",
							"Value": "BATON ROUGE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BILLINGS",
							"Value": "BILLINGS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BINGHAMTON",
							"Value": "BINGHAMTON",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BIRMINGHAM",
							"Value": "BIRMINGHAM",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BOISE 2",
							"Value": "BOISE 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BOSTON 2",
							"Value": "BOSTON 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BROOKFIELD",
							"Value": "BROOKFIELD",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BURLINGTON",
							"Value": "BURLINGTON",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "CHARLOTTE",
							"Value": "CHARLOTTE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "CHARLOTTESVILLE",
							"Value": "CHARLOTTESVILLE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "CHICAGO",
							"Value": "CHICAGO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "CINCINNATI",
							"Value": "CINCINNATI",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "CLEVELAND",
							"Value": "CLEVELAND",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "COLORADO SPRINGS",
							"Value": "COLORADO SPRINGS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "COLUMBIA",
							"Value": "COLUMBIA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "COLUMBUS",
							"Value": "COLUMBUS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "COLUMBUS 2",
							"Value": "COLUMBUS 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "COLUMBUS GA",
							"Value": "COLUMBUS GA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "DALLAS",
							"Value": "DALLAS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "DAYTON",
							"Value": "DAYTON",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "<default> DENVER",
							"Value": "DENVER",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "DES MOINES",
							"Value": "DES MOINES",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "DETROIT",
							"Value": "DETROIT",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "EL PASO",
							"Value": "EL PASO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "FAYETTEVILLE",
							"Value": "FAYETTEVILLE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "FORT MYERS",
							"Value": "FORT MYERS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "FORT WORTH",
							"Value": "FORT WORTH",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "FRESNO",
							"Value": "FRESNO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "FT. LAUDERDALE",
							"Value": "FT. LAUDERDALE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "FT. WORTH",
							"Value": "FT. WORTH",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "GREENSBORO",
							"Value": "GREENSBORO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "GREENVILLE",
							"Value": "GREENVILLE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "HARRISBURG",
							"Value": "HARRISBURG",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "HONOLULU 2",
							"Value": "HONOLULU 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "HOUSTON",
							"Value": "HOUSTON",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "HUNTSVILLE",
							"Value": "HUNTSVILLE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "INDIANAPOLIS",
							"Value": "INDIANAPOLIS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "INLAND EMPIRE",
							"Value": "INLAND EMPIRE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "JACKSONVILLE",
							"Value": "JACKSONVILLE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "JERSEY CITY",
							"Value": "JERSEY CITY",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "KANSAS CITY",
							"Value": "KANSAS CITY",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "LAKE CHARLES",
							"Value": "LAKE CHARLES",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "LAS VEGAS",
							"Value": "LAS VEGAS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "LEXINGTON",
							"Value": "LEXINGTON",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "LITTLE ROCK",
							"Value": "LITTLE ROCK",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "LOS ANGELES",
							"Value": "LOS ANGELES",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "LOUISVILLE2",
							"Value": "LOUISVILLE2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "MANHATTAN",
							"Value": "MANHATTAN",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "MEMPHIS",
							"Value": "MEMPHIS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "MILWAUKEE",
							"Value": "MILWAUKEE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "MINNEAPOLIS 2",
							"Value": "MINNEAPOLIS 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "MOBILE",
							"Value": "MOBILE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "MONTGOMERY",
							"Value": "MONTGOMERY",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "MONTREAL",
							"Value": "MONTREAL",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "NASHVILLE 2",
							"Value": "NASHVILLE 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "NEW ORLEANS",
							"Value": "NEW ORLEANS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "NEWARK",
							"Value": "NEWARK",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "OAKLAND",
							"Value": "OAKLAND",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "OMAHA",
							"Value": "OMAHA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ONTARIO",
							"Value": "ONTARIO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ORANGE COUNTY",
							"Value": "ORANGE COUNTY",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ORLANDO",
							"Value": "ORLANDO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "PHILADELPHIA",
							"Value": "PHILADELPHIA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "PHOENIX",
							"Value": "PHOENIX",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "PITTSBURGH",
							"Value": "PITTSBURGH",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "PORTLAND",
							"Value": "PORTLAND",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "RALEIGH",
							"Value": "RALEIGH",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "RICHMOND",
							"Value": "RICHMOND",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "RICHMOND 2",
							"Value": "RICHMOND 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ROCHESTER2",
							"Value": "ROCHESTER2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SACREMENTO",
							"Value": "SACREMENTO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SALT LAKE CITY",
							"Value": "SALT LAKE CITY",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SAN ANTONIO",
							"Value": "SAN ANTONIO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SAN DIEGO",
							"Value": "SAN DIEGO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SAN FRANCISCO",
							"Value": "SAN FRANCISCO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SAN LUIS OBISPO",
							"Value": "SAN LUIS OBISPO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SANTA BARBARA",
							"Value": "SANTA BARBARA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SEATTLE",
							"Value": "SEATTLE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SHREVEPORT",
							"Value": "SHREVEPORT",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SPOKANE",
							"Value": "SPOKANE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ST. LOUIS",
							"Value": "ST. LOUIS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SUNNYVALE",
							"Value": "SUNNYVALE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "TAMPA",
							"Value": "TAMPA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "TORONTO",
							"Value": "TORONTO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "TUCSON",
							"Value": "TUCSON",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "TULSA",
							"Value": "TULSA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "WASHINGTON DC",
							"Value": "WASHINGTON DC",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "WASHINGTON DC 2",
							"Value": "WASHINGTON DC 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "WICHITA",
							"Value": "WICHITA",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "In Service Area",
				"AttributeDisplayValue": "Yes",
				"AttributeValue": "Yes",
				"PcatDefinition": {
					"Name": "In Service Area",
					"Label": "In Service Area",
					"Type": "Text",
					"Optional": "PreActivation",
					"DefaultValue": "Yes",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> Yes",
							"Value": "Yes",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Intrastate Certification",
				"AttributeDisplayValue": "No",
				"AttributeValue": "No",
				"PcatDefinition": {
					"Name": "Intrastate Certification",
					"Label": "Intrastate Certification",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "No",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> No",
							"Value": "No",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "Yes",
							"Value": "Yes",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Secure Company",
				"AttributeDisplayValue": null,
				"AttributeValue": null,
				"PcatDefinition": {
					"Name": "Secure Company",
					"Label": "Secure Company",
					"Type": "Text",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Customer Number",
				"AttributeDisplayValue": null,
				"AttributeValue": null,
				"PcatDefinition": {
					"Name": "Customer Number",
					"Label": "Customer Number",
					"Type": "Text",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Account Number",
				"AttributeDisplayValue": "2-L3CJPK",
				"AttributeValue": "2-L3CJPK",
				"PcatDefinition": {
					"Name": "Account Number",
					"Label": "Account Number",
					"Type": "Text",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "2-L3CJPK",
							"Value": "2-L3CJPK",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Network Architecture",
				"AttributeDisplayValue": "Metro3",
				"AttributeValue": "Metro3",
				"PcatDefinition": {
					"Name": "Network Architecture",
					"Label": "Network Architecture",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "Metro3",
							"Value": "Metro3",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "ECN Enabled",
				"AttributeDisplayValue": "false",
				"AttributeValue": "false",
				"PcatDefinition": {
					"Name": "ECN Enabled",
					"Label": "ECN Enabled",
					"Type": "List",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "false",
							"Value": "false",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Network Color",
				"AttributeDisplayValue": "Not Green",
				"AttributeValue": "Not Green",
				"PcatDefinition": {
					"Name": "Network Color",
					"Label": "Network Color",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "Not Green",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "Green",
							"Value": "Green",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "<default> Not Green",
							"Value": "Not Green",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "VPOP",
				"AttributeDisplayValue": "false",
				"AttributeValue": "false",
				"PcatDefinition": {
					"Name": "VPOP",
					"Label": "VPOP",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "false",
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> false",
							"Value": "false",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Term",
				"AttributeDisplayValue": "36",
				"AttributeValue": "36",
				"PcatDefinition": {
					"Name": "Term",
					"Label": "Term",
					"Type": "Integer",
					"Optional": "PreActivation",
					"DefaultValue": "36",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": "{RANGE:1.0:120.0}",
					"DataConstraintValues": {
						"Minimum": 1,
						"Maximum": 120,
						"DataConstraintType": 1
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "EVC Type",
				"AttributeDisplayValue": null,
				"AttributeValue": null,
				"PcatDefinition": {
					"Name": "EVC Type",
					"Label": "EVC Type",
					"Type": "Relation",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": "Connections.EVC Type",
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "User",
				"AttributeDisplayValue": null,
				"AttributeValue": null,
				"PcatDefinition": {
					"Name": "User",
					"Label": "User",
					"Type": "Text",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": null,
							"Value": null,
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "SourceSystemID",
				"AttributeDisplayValue": null,
				"AttributeValue": null,
				"PcatDefinition": {
					"Name": "SourceSystemID",
					"Label": "SourceSystemID",
					"Type": "Text",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": null,
							"Value": null,
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Petra Pricing",
				"AttributeDisplayValue": "No",
				"AttributeValue": "No",
				"PcatDefinition": {
					"Name": "Petra Pricing",
					"Label": "Petra Pricing",
					"Type": "List",
					"Optional": "None",
					"DefaultValue": "No",
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> No",
							"Value": "No",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Auto Estimate",
				"AttributeDisplayValue": "No",
				"AttributeValue": "No",
				"PcatDefinition": {
					"Name": "Auto Estimate",
					"Label": "Auto Estimate",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "No",
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> No",
							"Value": "No",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Zone Based Pricing",
				"AttributeDisplayValue": "false",
				"AttributeValue": "false",
				"PcatDefinition": {
					"Name": "Zone Based Pricing",
					"Label": "Zone Based Pricing",
					"Type": "Text",
					"Optional": "None",
					"DefaultValue": "false",
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> false",
							"Value": "false",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Lumen Network",
				"AttributeDisplayValue": "Metro 3 Colorless Multitenant NID",
				"AttributeValue": "Metro 3 Colorless Multitenant NID",
				"PcatDefinition": {
					"Name": "Lumen Network",
					"Label": "Lumen Network",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "Metro 3 Colorless Multitenant NID",
							"Value": "Metro 3 Colorless Multitenant NID",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Legacy UNI",
				"AttributeDisplayValue": "No",
				"AttributeValue": "No",
				"PcatDefinition": {
					"Name": "Legacy UNI",
					"Label": "Legacy UNI",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "No",
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> No",
							"Value": "No",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Set Solution ID",
				"AttributeDisplayValue": null,
				"AttributeValue": null,
				"PcatDefinition": {
					"Name": "Set Solution ID",
					"Label": "Set Solution ID",
					"Type": "Text",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			}
		],
		"ProductInfoAttributes": [
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Promotion",
				"AttributeDisplayValue": "Standard Price",
				"AttributeValue": "NONE",
				"PcatDefinition": {
					"Name": null,
					"Label": null,
					"Type": "List",
					"Optional": null,
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": true,
					"MaxRepeats": 0,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": null,
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "Standard Price",
							"Value": "NONE",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": null,
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Market",
				"AttributeDisplayValue": "DENVER",
				"AttributeValue": "1057",
				"PcatDefinition": {
					"Name": null,
					"Label": null,
					"Type": "List",
					"Optional": null,
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": true,
					"MaxRepeats": 0,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": null,
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "DENVER",
							"Value": "1057",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": null,
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			}
		],
		"PriceInfo": {
			"ProductInstanceId": 0,
			"TransactionId": 556181595,
			"Action": "Add",
			"Quantity": 1,
			"MrcStandard": 642.2,
			"NrcStandard": 500,
			"MrcAdjusted": 642.2,
			"NrcAdjusted": 500,
			"MrcDiscount": "0%",
			"NrcDiscount": "0%",
			"MrcDiscountType": null,
			"NrcDiscountType": null,
			"RequiresIcb": true,
			"PrepaidMinutes": 0,
			"PriceDetails": [
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Requires ICB because discount is greater than flex policy allows.",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Delivery to the MPoE - Building Extension to customer suite NOT included",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Service Level = 24x7x4",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "No Capital Approval Request needed for this product configuration.",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Port Bandwidth = 1 Gbps",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "This order may require a longer interval of 60 - 90 days.",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Metro Mrc = $388.00, USD",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Metro Nrc = $0.00, USD",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Budgetary Pricing = No",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "[MultiTerm12Used][MultiTerm12Month]",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "[MultiTerm24Used][MultiTerm24Month]",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "[MultiTerm36Used][MultiTerm36Month]",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "[MultiTerm60Used][MultiTerm60Month]",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Original Mrc=$642.2 , USD; Original Nrc=$500 , USD",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "*****  ITEMS BELOW ARE FOR TESTING PURPOSES ONLY  *****",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "MetronEligible=1, GatedQuoteOrder=0",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "DiscountedMrc = 642.2,  StandardMrc = 676",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "TableMrc = 485,  OnNetMrc = 388",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Bandwidth = Not Applicable for On Net Locations,  Port Bandwidth = 1 Gbps",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "AddRedOrOrange=1, AddGreenL=0, AddGreenN=0",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "CTLWireCenter=true, AddNoColorWireCenter=0",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Network Color=Not Green, NetworkColorGreen=0",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "NetStatusChangedToOnNet = 0,Network Status = On Net",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "OnNet=1, AddGreenOnly=0",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "NewInvbdEthernet = 0",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "BuildingCategory = 5",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "BuildingClli = LAB4COZW",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "CARDisplay = 1,  CARRequired = 0",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "RegenSite = false,  AutoAugEth = true",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "ABWCapable = true,  AEthBWCapable = [AEthBWCapable]",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "CatApproval= false,  CARBuilding= 0",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "InvestmentBuilding= false,CATApprovalSimplyOnNet=[CATApprovalSimplyOnNet]",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "CalcBandwidth=1000 Mbps",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Port Bandwidth=1 Gbps",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Audience = Order",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "ServesMultCust= Y,  AddressRegion=NA",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "AddBuildingExtension = ME4",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Inside Wiring = Standard Delivery - To the MPoE (Customer Provided), InsideWiringNA = [InsideWiringNA]",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "AddressRegion=NA,  AddressState=CO",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "PricingIcb=true,WireCenter=[WireCenter]",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "EVC Type=[EVC Type],DefaultSolutionID=[DefaultSolutionID]",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Network Architecture=Metro3",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "FlexPercent=0.5",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "Solution ID=[Solution ID],Set Solution ID = [Set Solution ID]",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				},
				{
					"ProductInstanceId": 0,
					"TransactionId": 556181595,
					"ItemNumber": 0,
					"Description": "ContractedRateMrc=-1,ContractedRateNrc=-1",
					"Quantity": null,
					"UnitMrc": null,
					"UnitNrc": null
				}
			],
			"UsageDetails": [],
			"CurrencyCode": "USD",
			"MrcApplicable": true,
			"NrcApplicable": true,
			"MrcIsPercentDiscountType": false,
			"NrcIsPercentDiscountType": false,
			"MrcIsAmountDiscountType": true,
			"NrcIsAmountDiscountType": true,
			"MrcDiscountAmount": 0,
			"MrcDiscountPercent": 0,
			"NrcDiscountAmount": 0,
			"NrcDiscountPercent": 0
		},
		"Charges": [],
		"ProductKeyAttributes": [
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Product",
				"AttributeDisplayValue": "Fabric Port",
				"AttributeValue": "160",
				"PcatDefinition": {
					"Name": null,
					"Label": null,
					"Type": "Text",
					"Optional": null,
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 0,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": null,
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": null,
					"RequiredElements": null,
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "OverrideMrc",
				"AttributeDisplayValue": "-1",
				"AttributeValue": "-1",
				"PcatDefinition": {
					"Name": "OverrideMrc",
					"Label": "OverrideMrc",
					"Type": "Override",
					"Optional": "None",
					"DefaultValue": "-1",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "OverrideNrc",
				"AttributeDisplayValue": "-1",
				"AttributeValue": "-1",
				"PcatDefinition": {
					"Name": "OverrideNrc",
					"Label": "OverrideNrc",
					"Type": "Override",
					"Optional": "None",
					"DefaultValue": "-1",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Address1",
				"AttributeDisplayValue": null,
				"AttributeValue": null,
				"PcatDefinition": {
					"Name": "Address1",
					"Label": "Address1",
					"Type": "Address",
					"Optional": "PreActivation",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [],
					"RequiredElements": [
						"EthernetCompEnv"
					],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Opportunity Type",
				"AttributeDisplayValue": "New",
				"AttributeValue": "New",
				"PcatDefinition": {
					"Name": "Opportunity Type",
					"Label": "Opportunity Type",
					"Type": "List",
					"Optional": "None",
					"DefaultValue": "New",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> New",
							"Value": "New",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "CPT",
				"AttributeDisplayValue": "CSP3",
				"AttributeValue": "CSP3",
				"PcatDefinition": {
					"Name": "CPT",
					"Label": "Pricing Tier",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "CSP3",
							"Value": "CSP3",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Flex",
				"AttributeDisplayValue": "CSP",
				"AttributeValue": "CSP",
				"PcatDefinition": {
					"Name": null,
					"Label": null,
					"Type": "List",
					"Optional": null,
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 0,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": null,
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "CSP",
							"Value": "CSP",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": null,
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Network Status",
				"AttributeDisplayValue": "On Net",
				"AttributeValue": "On Net",
				"PcatDefinition": {
					"Name": "Network Status",
					"Label": "Network Status",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "On Net",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "Off Net",
							"Value": "Off Net",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "<default> On Net",
							"Value": "On Net",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Port Bandwidth",
				"AttributeDisplayValue": "1 Gbps",
				"AttributeValue": "1000 Mbps",
				"PcatDefinition": {
					"Name": "Port Bandwidth",
					"Label": "Port Bandwidth",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "1 Gbps",
							"Value": "1000 Mbps",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "10 Gbps",
							"Value": "10000 Mbps",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "High Bandwidth",
				"AttributeDisplayValue": "No",
				"AttributeValue": "No",
				"PcatDefinition": {
					"Name": "High Bandwidth",
					"Label": "Full Port Speed",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "No",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> No",
							"Value": "No",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Bandwidth",
				"AttributeDisplayValue": "Not Applicable for On Net Locations",
				"AttributeValue": "Not Applicable for On Net Locations",
				"PcatDefinition": {
					"Name": "Bandwidth",
					"Label": "Bandwidth",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "Not Applicable for On Net Locations",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> Not Applicable for On Net Locations",
							"Value": "Not Applicable for On Net Locations",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Intent",
				"AttributeDisplayValue": "NaaS",
				"AttributeValue": "NaaS",
				"PcatDefinition": {
					"Name": "Intent",
					"Label": "Intent",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "NaaS",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "Ethernet",
							"Value": "Ethernet",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "<default> NaaS (IoD or EoD)",
							"Value": "NaaS",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "UNI Type",
				"AttributeDisplayValue": "Multiplexed",
				"AttributeValue": "Multiplexed",
				"PcatDefinition": {
					"Name": "UNI Type",
					"Label": "UNI Type",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "Multiplexed",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> Multiplexed",
							"Value": "Multiplexed",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "3rd Party Cross Connect",
				"AttributeDisplayValue": "No",
				"AttributeValue": "No",
				"PcatDefinition": {
					"Name": "3rd Party Cross Connect",
					"Label": "3rd Party Cross Connect",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "No",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> No",
							"Value": "No",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "Yes",
							"Value": "Yes",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Cloud Provider",
				"AttributeDisplayValue": "N/A",
				"AttributeValue": "N/A",
				"PcatDefinition": {
					"Name": "Cloud Provider",
					"Label": "Cloud Provider",
					"Type": "List",
					"Optional": "None",
					"DefaultValue": "N/A",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> N/A",
							"Value": "N/A",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Inside Wiring",
				"AttributeDisplayValue": "Standard Delivery - To the MPoE (Customer Provided)",
				"AttributeValue": "Standard Delivery - To the MPoE (Customer Provided)",
				"PcatDefinition": {
					"Name": "Inside Wiring",
					"Label": "Building Extension",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "Extended Delivery - To the Customer Suite (Lumen Provided)",
							"Value": "Extended Delivery - To the Customer Suite (Level 3 Provided)",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "Standard Delivery - To the MPoE (Customer Provided)",
							"Value": "Standard Delivery - To the MPoE (Customer Provided)",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "IP Pop",
				"AttributeDisplayValue": "DENVER",
				"AttributeValue": "DENVER",
				"PcatDefinition": {
					"Name": "IP Pop",
					"Label": "IP Pop",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "DENVER",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "ALBANY",
							"Value": "ALBANY",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ALBUQUERQUE",
							"Value": "ALBUQUERQUE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ASHBURN",
							"Value": "ASHBURN",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ATLANTA",
							"Value": "ATLANTA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "AUSTIN",
							"Value": "AUSTIN",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BAKERSFIELD",
							"Value": "BAKERSFIELD",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BALTIMORE",
							"Value": "BALTIMORE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BATON ROUGE",
							"Value": "BATON ROUGE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BILLINGS",
							"Value": "BILLINGS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BINGHAMTON",
							"Value": "BINGHAMTON",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BIRMINGHAM",
							"Value": "BIRMINGHAM",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BOISE 2",
							"Value": "BOISE 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BOSTON 2",
							"Value": "BOSTON 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BROOKFIELD",
							"Value": "BROOKFIELD",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "BURLINGTON",
							"Value": "BURLINGTON",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "CHARLOTTE",
							"Value": "CHARLOTTE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "CHARLOTTESVILLE",
							"Value": "CHARLOTTESVILLE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "CHICAGO",
							"Value": "CHICAGO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "CINCINNATI",
							"Value": "CINCINNATI",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "CLEVELAND",
							"Value": "CLEVELAND",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "COLORADO SPRINGS",
							"Value": "COLORADO SPRINGS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "COLUMBIA",
							"Value": "COLUMBIA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "COLUMBUS",
							"Value": "COLUMBUS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "COLUMBUS 2",
							"Value": "COLUMBUS 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "COLUMBUS GA",
							"Value": "COLUMBUS GA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "DALLAS",
							"Value": "DALLAS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "DAYTON",
							"Value": "DAYTON",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "<default> DENVER",
							"Value": "DENVER",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "DES MOINES",
							"Value": "DES MOINES",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "DETROIT",
							"Value": "DETROIT",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "EL PASO",
							"Value": "EL PASO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "FAYETTEVILLE",
							"Value": "FAYETTEVILLE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "FORT MYERS",
							"Value": "FORT MYERS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "FORT WORTH",
							"Value": "FORT WORTH",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "FRESNO",
							"Value": "FRESNO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "FT. LAUDERDALE",
							"Value": "FT. LAUDERDALE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "FT. WORTH",
							"Value": "FT. WORTH",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "GREENSBORO",
							"Value": "GREENSBORO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "GREENVILLE",
							"Value": "GREENVILLE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "HARRISBURG",
							"Value": "HARRISBURG",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "HONOLULU 2",
							"Value": "HONOLULU 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "HOUSTON",
							"Value": "HOUSTON",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "HUNTSVILLE",
							"Value": "HUNTSVILLE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "INDIANAPOLIS",
							"Value": "INDIANAPOLIS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "INLAND EMPIRE",
							"Value": "INLAND EMPIRE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "JACKSONVILLE",
							"Value": "JACKSONVILLE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "JERSEY CITY",
							"Value": "JERSEY CITY",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "KANSAS CITY",
							"Value": "KANSAS CITY",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "LAKE CHARLES",
							"Value": "LAKE CHARLES",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "LAS VEGAS",
							"Value": "LAS VEGAS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "LEXINGTON",
							"Value": "LEXINGTON",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "LITTLE ROCK",
							"Value": "LITTLE ROCK",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "LOS ANGELES",
							"Value": "LOS ANGELES",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "LOUISVILLE2",
							"Value": "LOUISVILLE2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "MANHATTAN",
							"Value": "MANHATTAN",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "MEMPHIS",
							"Value": "MEMPHIS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "MILWAUKEE",
							"Value": "MILWAUKEE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "MINNEAPOLIS 2",
							"Value": "MINNEAPOLIS 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "MOBILE",
							"Value": "MOBILE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "MONTGOMERY",
							"Value": "MONTGOMERY",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "MONTREAL",
							"Value": "MONTREAL",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "NASHVILLE 2",
							"Value": "NASHVILLE 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "NEW ORLEANS",
							"Value": "NEW ORLEANS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "NEWARK",
							"Value": "NEWARK",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "OAKLAND",
							"Value": "OAKLAND",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "OMAHA",
							"Value": "OMAHA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ONTARIO",
							"Value": "ONTARIO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ORANGE COUNTY",
							"Value": "ORANGE COUNTY",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ORLANDO",
							"Value": "ORLANDO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "PHILADELPHIA",
							"Value": "PHILADELPHIA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "PHOENIX",
							"Value": "PHOENIX",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "PITTSBURGH",
							"Value": "PITTSBURGH",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "PORTLAND",
							"Value": "PORTLAND",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "RALEIGH",
							"Value": "RALEIGH",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "RICHMOND",
							"Value": "RICHMOND",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "RICHMOND 2",
							"Value": "RICHMOND 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ROCHESTER2",
							"Value": "ROCHESTER2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SACREMENTO",
							"Value": "SACREMENTO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SALT LAKE CITY",
							"Value": "SALT LAKE CITY",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SAN ANTONIO",
							"Value": "SAN ANTONIO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SAN DIEGO",
							"Value": "SAN DIEGO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SAN FRANCISCO",
							"Value": "SAN FRANCISCO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SAN LUIS OBISPO",
							"Value": "SAN LUIS OBISPO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SANTA BARBARA",
							"Value": "SANTA BARBARA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SEATTLE",
							"Value": "SEATTLE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SHREVEPORT",
							"Value": "SHREVEPORT",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SPOKANE",
							"Value": "SPOKANE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "ST. LOUIS",
							"Value": "ST. LOUIS",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "SUNNYVALE",
							"Value": "SUNNYVALE",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "TAMPA",
							"Value": "TAMPA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "TORONTO",
							"Value": "TORONTO",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "TUCSON",
							"Value": "TUCSON",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "TULSA",
							"Value": "TULSA",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "WASHINGTON DC",
							"Value": "WASHINGTON DC",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "WASHINGTON DC 2",
							"Value": "WASHINGTON DC 2",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "WICHITA",
							"Value": "WICHITA",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "In Service Area",
				"AttributeDisplayValue": "Yes",
				"AttributeValue": "Yes",
				"PcatDefinition": {
					"Name": "In Service Area",
					"Label": "In Service Area",
					"Type": "Text",
					"Optional": "PreActivation",
					"DefaultValue": "Yes",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> Yes",
							"Value": "Yes",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Intrastate Certification",
				"AttributeDisplayValue": "No",
				"AttributeValue": "No",
				"PcatDefinition": {
					"Name": "Intrastate Certification",
					"Label": "Intrastate Certification",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "No",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> No",
							"Value": "No",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "Yes",
							"Value": "Yes",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Secure Company",
				"AttributeDisplayValue": null,
				"AttributeValue": null,
				"PcatDefinition": {
					"Name": "Secure Company",
					"Label": "Secure Company",
					"Type": "Text",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Customer Number",
				"AttributeDisplayValue": null,
				"AttributeValue": null,
				"PcatDefinition": {
					"Name": "Customer Number",
					"Label": "Customer Number",
					"Type": "Text",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Account Number",
				"AttributeDisplayValue": "2-L3CJPK",
				"AttributeValue": "2-L3CJPK",
				"PcatDefinition": {
					"Name": "Account Number",
					"Label": "Account Number",
					"Type": "Text",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "2-L3CJPK",
							"Value": "2-L3CJPK",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Network Architecture",
				"AttributeDisplayValue": "Metro3",
				"AttributeValue": "Metro3",
				"PcatDefinition": {
					"Name": "Network Architecture",
					"Label": "Network Architecture",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "Metro3",
							"Value": "Metro3",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "ECN Enabled",
				"AttributeDisplayValue": "false",
				"AttributeValue": "false",
				"PcatDefinition": {
					"Name": "ECN Enabled",
					"Label": "ECN Enabled",
					"Type": "List",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "false",
							"Value": "false",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Network Color",
				"AttributeDisplayValue": "Not Green",
				"AttributeValue": "Not Green",
				"PcatDefinition": {
					"Name": "Network Color",
					"Label": "Network Color",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "Not Green",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "Green",
							"Value": "Green",
							"ID": null,
							"NumericEquivelent": null
						},
						{
							"DisplayValue": "<default> Not Green",
							"Value": "Not Green",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "VPOP",
				"AttributeDisplayValue": "false",
				"AttributeValue": "false",
				"PcatDefinition": {
					"Name": "VPOP",
					"Label": "VPOP",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "false",
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> false",
							"Value": "false",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Term",
				"AttributeDisplayValue": "36",
				"AttributeValue": "36",
				"PcatDefinition": {
					"Name": "Term",
					"Label": "Term",
					"Type": "Integer",
					"Optional": "PreActivation",
					"DefaultValue": "36",
					"OtherAttributeName": null,
					"Enable": true,
					"Visible": true,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": "{RANGE:1.0:120.0}",
					"DataConstraintValues": {
						"Minimum": 1,
						"Maximum": 120,
						"DataConstraintType": 1
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "EVC Type",
				"AttributeDisplayValue": null,
				"AttributeValue": null,
				"PcatDefinition": {
					"Name": "EVC Type",
					"Label": "EVC Type",
					"Type": "Relation",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": "Connections.EVC Type",
					"Enable": true,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "User",
				"AttributeDisplayValue": null,
				"AttributeValue": null,
				"PcatDefinition": {
					"Name": "User",
					"Label": "User",
					"Type": "Text",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": null,
							"Value": null,
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "SourceSystemID",
				"AttributeDisplayValue": null,
				"AttributeValue": null,
				"PcatDefinition": {
					"Name": "SourceSystemID",
					"Label": "SourceSystemID",
					"Type": "Text",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": null,
							"Value": null,
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Petra Pricing",
				"AttributeDisplayValue": "No",
				"AttributeValue": "No",
				"PcatDefinition": {
					"Name": "Petra Pricing",
					"Label": "Petra Pricing",
					"Type": "List",
					"Optional": "None",
					"DefaultValue": "No",
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> No",
							"Value": "No",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Auto Estimate",
				"AttributeDisplayValue": "No",
				"AttributeValue": "No",
				"PcatDefinition": {
					"Name": "Auto Estimate",
					"Label": "Auto Estimate",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "No",
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> No",
							"Value": "No",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Zone Based Pricing",
				"AttributeDisplayValue": "false",
				"AttributeValue": "false",
				"PcatDefinition": {
					"Name": "Zone Based Pricing",
					"Label": "Zone Based Pricing",
					"Type": "Text",
					"Optional": "None",
					"DefaultValue": "false",
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> false",
							"Value": "false",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Lumen Network",
				"AttributeDisplayValue": "Metro 3 Colorless Multitenant NID",
				"AttributeValue": "Metro 3 Colorless Multitenant NID",
				"PcatDefinition": {
					"Name": "Lumen Network",
					"Label": "Lumen Network",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "Metro 3 Colorless Multitenant NID",
							"Value": "Metro 3 Colorless Multitenant NID",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Legacy UNI",
				"AttributeDisplayValue": "No",
				"AttributeValue": "No",
				"PcatDefinition": {
					"Name": "Legacy UNI",
					"Label": "Legacy UNI",
					"Type": "List",
					"Optional": "PreActivation",
					"DefaultValue": "No",
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "<default> No",
							"Value": "No",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": [],
					"RestartWorkflow": true
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Promotion",
				"AttributeDisplayValue": "Standard Price",
				"AttributeValue": "NONE",
				"PcatDefinition": {
					"Name": null,
					"Label": null,
					"Type": "List",
					"Optional": null,
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": true,
					"MaxRepeats": 0,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": null,
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "Standard Price",
							"Value": "NONE",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": null,
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Market",
				"AttributeDisplayValue": "DENVER",
				"AttributeValue": "1057",
				"PcatDefinition": {
					"Name": null,
					"Label": null,
					"Type": "List",
					"Optional": null,
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": true,
					"MaxRepeats": 0,
					"Mask": null,
					"DataConstraint": null,
					"DataConstraintValues": null,
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [
						{
							"DisplayValue": "DENVER",
							"Value": "1057",
							"ID": null,
							"NumericEquivelent": null
						}
					],
					"RequiredElements": null,
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": false,
				"UserModified": false
			},
			{
				"ProductInstanceId": 0,
				"TransactionId": 556181595,
				"Action": "Add",
				"AttributeName": "Set Solution ID",
				"AttributeDisplayValue": null,
				"AttributeValue": null,
				"PcatDefinition": {
					"Name": "Set Solution ID",
					"Label": "Set Solution ID",
					"Type": "Text",
					"Optional": "None",
					"DefaultValue": null,
					"OtherAttributeName": null,
					"Enable": false,
					"Visible": false,
					"MaxRepeats": 1,
					"Mask": "",
					"DataConstraint": null,
					"DataConstraintValues": {
						"Minimum": -7.922816251426434e28,
						"Maximum": 7.922816251426434e28,
						"DataConstraintType": 0
					},
					"InternalOnly": false,
					"ComplexType": 0,
					"IsValid": true,
					"RequiresRefresh": false,
					"ErrorString": null,
					"NetCrackerId": null,
					"AffectsLinkedAttributes": false,
					"LinkedAttribute": null,
					"Values": [],
					"RequiredElements": [],
					"RestartWorkflow": false
				},
				"AttributeId": null,
				"AttributeNumericEquivalent": 0,
				"Deleted": false,
				"IsRequired": false,
				"ApplicableForChange": true,
				"UserModified": false
			}
		],
		"Properties": [
			{
				"Action": "Add",
				"TransactionId": 556181595,
				"PropertyName": "Promotion_Code",
				"PropertyValue": "NONE",
				"ProductInstanceId": 0,
				"IsProductPropertyUpdated": false
			},
			{
				"Action": "Add",
				"TransactionId": 556181595,
				"PropertyName": "Account_Number",
				"PropertyValue": "304254",
				"ProductInstanceId": 0,
				"IsProductPropertyUpdated": false
			},
			{
				"Action": "Add",
				"TransactionId": 556181595,
				"PropertyName": "Kenan_BAN",
				"PropertyValue": "5-SCDKVVQ3",
				"ProductInstanceId": 0,
				"IsProductPropertyUpdated": false
			},
			{
				"Action": "Add",
				"TransactionId": 556181595,
				"PropertyName": "Invoice_Display_BAN",
				"PropertyValue": "304254",
				"ProductInstanceId": 0,
				"IsProductPropertyUpdated": false
			}
		],
		"RelatedNumbers": [],
		"AvailableRelationship": [
			{
				"Name": "Connections",
				"Products": [
					159,
					237,
					518
				],
				"Mininum": 0,
				"Maximun": 500,
				"Address": "",
				"ProductAttributeFilter": {
					"CurrentProduct": null,
					"RelatedProduct": null,
					"Comparison": "|",
					"Filter1": {
						"CurrentProduct": {
							"Name": "Address1",
							"Type": "Address",
							"Element": ""
						},
						"RelatedProduct": {
							"Name": "Address1",
							"Type": "Address",
							"Element": ""
						},
						"Comparison": "=",
						"Filter1": null,
						"Filter2": null
					},
					"Filter2": {
						"CurrentProduct": {
							"Name": "Address1",
							"Type": "Address",
							"Element": ""
						},
						"RelatedProduct": {
							"Name": "Address2",
							"Type": "Address",
							"Element": ""
						},
						"Comparison": "=",
						"Filter1": null,
						"Filter2": null
					}
				},
				"AdditionalFilteringRule": "Customer Number=Customer Number",
				"UserCanAssign": false
			}
		],
		"EditableRelationship": [],
		"MissedMandatoryRelationship": [],
		"MandatoryRelationship": [],
		"OptionalRelationship": [
			{
				"Name": "Connections",
				"Products": [
					159,
					237,
					518
				],
				"Mininum": 0,
				"Maximun": 500,
				"Address": "",
				"ProductAttributeFilter": {
					"CurrentProduct": null,
					"RelatedProduct": null,
					"Comparison": "|",
					"Filter1": {
						"CurrentProduct": {
							"Name": "Address1",
							"Type": "Address",
							"Element": ""
						},
						"RelatedProduct": {
							"Name": "Address1",
							"Type": "Address",
							"Element": ""
						},
						"Comparison": "=",
						"Filter1": null,
						"Filter2": null
					},
					"Filter2": {
						"CurrentProduct": {
							"Name": "Address1",
							"Type": "Address",
							"Element": ""
						},
						"RelatedProduct": {
							"Name": "Address2",
							"Type": "Address",
							"Element": ""
						},
						"Comparison": "=",
						"Filter1": null,
						"Filter2": null
					}
				},
				"AdditionalFilteringRule": "Customer Number=Customer Number",
				"UserCanAssign": false
			}
		],
		"BundlePackage": null,
		"IsProductKeyAdded": false,
		"IsProductKeyRemoved": false,
		"IsProductKeyCancelled": false,
		"IsProductKeyDisconnect": false,
		"IsProductKeyUpdated": false,
		"OriginalTransactionId": 0,
		"CurrencyCode": "USD",
		"ActionDisplayValue": null,
		"GPId": null,
		"CanAddProductKey": false,
		"UnableToAddMessage": null,
		"RootProductInstanceId": null,
		"ParentProductInstanceId": null,
		"IsChangeFlag": false,
		"IsFirstAppearance": false,
		"AllowOverrideMrc": false,
		"AllowOverrideNrc": false,
		"AllowOverrideYrc": false,
		"DisableProductPrices": false,
		"RoutingGroupOverride": null,
		"VendorAddressCorrelationId": null,
		"VendorAddressType": null,
		"VendorAddressStreetNumberDirectionalPrefix": null,
		"VendorAddressStreetNumberDirectionalSuffix": null,
		"VendorAddressStreetNameDirectionalPrefix": null,
		"VendorAddressStreetNameDirectionalSuffix": null,
		"VendorAddressLocationTypeOne": null,
		"VendorAddressLocationTypeTwo": null,
		"VendorAddressLocationTypeThree": null,
		"VendorAddressLocationDetailsOne": null,
		"VendorAddressLocationDetailsTwo": null,
		"VendorAddressLocationDetailsThree": null,
		"VendorAddressStreetName": null,
		"VendorAddressStreetNumber": null,
		"VendorAddressStreetType": null,
		"VendorAddressCity": null,
		"VendorAddressState": null,
		"VendorAddressZipCode": null,
		"VendorAddressBypassValidationReason": null,
		"VendorAddressBypassValidationFlag": null,
		"SpaceCode": null,
		"Mrc": 642.2,
		"Nrc": 500,
		"Yrc": {
			"ProductInstanceId": 0,
			"TransactionId": 556181595,
			"Name": "Fabric Port",
			"Action": "Add",
			"AmountStandard": 0,
			"AmountDiscount": 0,
			"AmountAdjusted": 0,
			"AllowOveride": false,
			"OverrideAttribute": null,
			"Frequency": {
				"name": "YRC",
				"description": "Annually Recurring Charge",
				"frequencyId": 3
			},
			"SuperUserOverride": false,
			"ToolTip": null,
			"AmortizedAmount": 0,
			"AmortizedTerm": 0,
			"PercentAmortized": 0,
			"DiscountPercent": 0
		},
		"MissedMandatoryRelatedProducts": [],
		"OptionalRelatedProductBtnHolder": {
			"ProductInstanceId": 0,
			"RelationshipName": null,
			"RelatedProductInstanceId": 0,
			"RelatedGlobalProductId": null,
			"TransactionId": 0,
			"RelatedProductTransactionId": 0,
			"Action": null,
			"RelatedRelationshipName": null,
			"Status": null,
			"RelatedProductId": 0,
			"ProductPackageId": 0,
			"RelatedProductPackageId": 0,
			"RelatedGlobalPackageId": null,
			"RelatedProductName": null,
			"RelatedProductServiceAlias": null,
			"IsMandatoryRelatedProduct": false,
			"UserCanAssign": false,
			"IsNoLongerValid": false,
			"RelatedPcatProductId": 0,
			"UserCanSever": null
		},
		"PromotionAttribute": {
			"ProductInstanceId": 0,
			"TransactionId": 556181595,
			"Action": "Add",
			"AttributeName": "Promotion",
			"AttributeDisplayValue": "Standard Price",
			"AttributeValue": "NONE",
			"PcatDefinition": {
				"Name": null,
				"Label": null,
				"Type": "List",
				"Optional": null,
				"DefaultValue": null,
				"OtherAttributeName": null,
				"Enable": false,
				"Visible": true,
				"MaxRepeats": 0,
				"Mask": null,
				"DataConstraint": null,
				"DataConstraintValues": null,
				"InternalOnly": false,
				"ComplexType": 0,
				"IsValid": true,
				"RequiresRefresh": false,
				"ErrorString": null,
				"NetCrackerId": null,
				"AffectsLinkedAttributes": false,
				"LinkedAttribute": null,
				"Values": [
					{
						"DisplayValue": "Standard Price",
						"Value": "NONE",
						"ID": null,
						"NumericEquivelent": null
					}
				],
				"RequiredElements": null,
				"RestartWorkflow": false
			},
			"AttributeId": null,
			"AttributeNumericEquivalent": 0,
			"Deleted": false,
			"IsRequired": false,
			"ApplicableForChange": false,
			"UserModified": false
		},
		"IsAsrVendorAddressVisible": false,
		"IsProductKeyRelatedNumbersModified": false,
		"IsForceModify": false,
		"OpenExistingAccountPageUrl": "http://am-test1/AMWeb/BillingAccount/Details/",
		"AmortizedTerm": 0,
		"AmortizedAmount": 0,
		"PercentAmortized": 0
	},
	"currencyCode": "USD",
	"relatedProductViewModels": []
}

















Resposne : 


{
  "ProductPackageId": 464259129,
  "TransactionId": 556181595,
  "Status": "Unknown",
  "InventoryStatus": "Unknown",
  "Action": "Add",
  "ActionDescription": "New",
  "PspTransactionType": "New",
  "RequestedEffectiveBillDate": null,
  "ExpeditedBillingDueDate": null,
  "RequestedBillingDueDate": null,
  "NegotiatedDueDate": null,
  "CommittedDueDate": null,
  "DesiredDueDate": null,
  "CustomerRequestedDate": null,
  "DueDateChangeInitiator": null,
  "DueDateChangeReason": null,
  "TurnUpProcessor": "SwiftInventory",
  "IsExpedited": false,
  "PspSecondaryOrderTypeId": null,
  "ServiceCompleteDate": null,
  "IsDueDateCommitted": false,
  "IsBillingAcceptanceRequired": false,
  "ServiceAcceptanceDate": null,
  "ActionChangeReasonId": null,
  "ActionChangeReason": null,
  "ActionChangeInitiator": null,
  "ActionChangeInitiatorId": null,
  "IsOrdered": false,
  "HasInProgress": false,
  "ParentProduct": {
    "ProductInstanceId": 352951848,
    "ProductPackageId": 464259129,
    "TransactionId": 556181595,
    "ProductId": 160,
    "IsParentProduct": true,
    "Action": "Add",
    "RequestedDueDate": null,
    "RequestedDueDateTimeZone": null,
    "PriceInfoId": 0,
    "MarketId": 1057,
    "PcatVersion": "23-Mar-26",
    "GroupingType": null,
    "EffectiveBillDate": "1/1/0001 12:00:00 AM",
    "ProductName": "Fabric Port",
    "AccountNumber": 304254,
    "KenanBAN": "5-SCDKVVQ3",
    "InvoiceDisplayBAN": "304254",
    "LexmBAN": null,
    "PromotionCode": "NONE",
    "IsExistingProduct": "No",
    "ProductCategory": null,
    "BanSelect": false,
    "ProductAttributes": [
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "CPT",
        "AttributeDisplayValue": "CSP3",
        "AttributeValue": "CSP3",
        "PcatDefinition": {
          "Name": "CPT",
          "Label": "Pricing Tier",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "CSP3",
              "Value": "CSP3",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Flex",
        "AttributeDisplayValue": "CSP",
        "AttributeValue": "CSP",
        "PcatDefinition": {
          "Name": null,
          "Label": null,
          "Type": "List",
          "Optional": null,
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 0,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": null,
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "CSP",
              "Value": "CSP",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": null,
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Network Status",
        "AttributeDisplayValue": "On Net",
        "AttributeValue": "On Net",
        "PcatDefinition": {
          "Name": "Network Status",
          "Label": "Network Status",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "On Net",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Off Net",
              "Value": "Off Net",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "<default> On Net",
              "Value": "On Net",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Port Bandwidth",
        "AttributeDisplayValue": "1 Gbps",
        "AttributeValue": "1000 Mbps",
        "PcatDefinition": {
          "Name": "Port Bandwidth",
          "Label": "Port Bandwidth",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "1 Gbps",
              "Value": "1000 Mbps",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "10 Gbps",
              "Value": "10000 Mbps",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "High Bandwidth",
        "AttributeDisplayValue": "No",
        "AttributeValue": "No",
        "PcatDefinition": {
          "Name": "High Bandwidth",
          "Label": "Full Port Speed",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "No",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> No",
              "Value": "No",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Bandwidth",
        "AttributeDisplayValue": "Not Applicable for On Net Locations",
        "AttributeValue": "Not Applicable for On Net Locations",
        "PcatDefinition": {
          "Name": "Bandwidth",
          "Label": "Bandwidth",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "Not Applicable for On Net Locations",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> Not Applicable for On Net Locations",
              "Value": "Not Applicable for On Net Locations",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Intent",
        "AttributeDisplayValue": "NaaS",
        "AttributeValue": "NaaS",
        "PcatDefinition": {
          "Name": "Intent",
          "Label": "Intent",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "NaaS",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Ethernet",
              "Value": "Ethernet",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "<default> NaaS (IoD or EoD)",
              "Value": "NaaS",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "UNI Type",
        "AttributeDisplayValue": "Multiplexed",
        "AttributeValue": "Multiplexed",
        "PcatDefinition": {
          "Name": "UNI Type",
          "Label": "UNI Type",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "Multiplexed",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> Multiplexed",
              "Value": "Multiplexed",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "3rd Party Cross Connect",
        "AttributeDisplayValue": "No",
        "AttributeValue": "No",
        "PcatDefinition": {
          "Name": "3rd Party Cross Connect",
          "Label": "3rd Party Cross Connect",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "No",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> No",
              "Value": "No",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "Yes",
              "Value": "Yes",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Cloud Provider",
        "AttributeDisplayValue": "N/A",
        "AttributeValue": "N/A",
        "PcatDefinition": {
          "Name": "Cloud Provider",
          "Label": "Cloud Provider",
          "Type": "List",
          "Optional": "None",
          "DefaultValue": "N/A",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> N/A",
              "Value": "N/A",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Inside Wiring",
        "AttributeDisplayValue": "Standard Delivery - To the MPoE (Customer Provided)",
        "AttributeValue": "Standard Delivery - To the MPoE (Customer Provided)",
        "PcatDefinition": {
          "Name": "Inside Wiring",
          "Label": "Building Extension",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Extended Delivery - To the Customer Suite (Lumen Provided)",
              "Value": "Extended Delivery - To the Customer Suite (Level 3 Provided)",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "Standard Delivery - To the MPoE (Customer Provided)",
              "Value": "Standard Delivery - To the MPoE (Customer Provided)",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "IP Pop",
        "AttributeDisplayValue": "DENVER",
        "AttributeValue": "DENVER",
        "PcatDefinition": {
          "Name": "IP Pop",
          "Label": "IP Pop",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "DENVER",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "ALBANY",
              "Value": "ALBANY",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ALBUQUERQUE",
              "Value": "ALBUQUERQUE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ASHBURN",
              "Value": "ASHBURN",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ATLANTA",
              "Value": "ATLANTA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "AUSTIN",
              "Value": "AUSTIN",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BAKERSFIELD",
              "Value": "BAKERSFIELD",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BALTIMORE",
              "Value": "BALTIMORE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BATON ROUGE",
              "Value": "BATON ROUGE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BILLINGS",
              "Value": "BILLINGS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BINGHAMTON",
              "Value": "BINGHAMTON",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BIRMINGHAM",
              "Value": "BIRMINGHAM",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BOISE 2",
              "Value": "BOISE 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BOSTON 2",
              "Value": "BOSTON 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BROOKFIELD",
              "Value": "BROOKFIELD",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BURLINGTON",
              "Value": "BURLINGTON",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "CHARLOTTE",
              "Value": "CHARLOTTE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "CHARLOTTESVILLE",
              "Value": "CHARLOTTESVILLE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "CHICAGO",
              "Value": "CHICAGO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "CINCINNATI",
              "Value": "CINCINNATI",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "CLEVELAND",
              "Value": "CLEVELAND",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "COLORADO SPRINGS",
              "Value": "COLORADO SPRINGS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "COLUMBIA",
              "Value": "COLUMBIA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "COLUMBUS",
              "Value": "COLUMBUS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "COLUMBUS 2",
              "Value": "COLUMBUS 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "COLUMBUS GA",
              "Value": "COLUMBUS GA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "DALLAS",
              "Value": "DALLAS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "DAYTON",
              "Value": "DAYTON",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "<default> DENVER",
              "Value": "DENVER",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "DES MOINES",
              "Value": "DES MOINES",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "DETROIT",
              "Value": "DETROIT",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "EL PASO",
              "Value": "EL PASO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "FAYETTEVILLE",
              "Value": "FAYETTEVILLE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "FORT MYERS",
              "Value": "FORT MYERS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "FORT WORTH",
              "Value": "FORT WORTH",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "FRESNO",
              "Value": "FRESNO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "FT. LAUDERDALE",
              "Value": "FT. LAUDERDALE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "FT. WORTH",
              "Value": "FT. WORTH",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "GREENSBORO",
              "Value": "GREENSBORO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "GREENVILLE",
              "Value": "GREENVILLE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "HARRISBURG",
              "Value": "HARRISBURG",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "HONOLULU 2",
              "Value": "HONOLULU 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "HOUSTON",
              "Value": "HOUSTON",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "HUNTSVILLE",
              "Value": "HUNTSVILLE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "INDIANAPOLIS",
              "Value": "INDIANAPOLIS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "INLAND EMPIRE",
              "Value": "INLAND EMPIRE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "JACKSONVILLE",
              "Value": "JACKSONVILLE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "JERSEY CITY",
              "Value": "JERSEY CITY",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "KANSAS CITY",
              "Value": "KANSAS CITY",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "LAKE CHARLES",
              "Value": "LAKE CHARLES",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "LAS VEGAS",
              "Value": "LAS VEGAS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "LEXINGTON",
              "Value": "LEXINGTON",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "LITTLE ROCK",
              "Value": "LITTLE ROCK",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "LOS ANGELES",
              "Value": "LOS ANGELES",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "LOUISVILLE2",
              "Value": "LOUISVILLE2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "MANHATTAN",
              "Value": "MANHATTAN",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "MEMPHIS",
              "Value": "MEMPHIS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "MILWAUKEE",
              "Value": "MILWAUKEE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "MINNEAPOLIS 2",
              "Value": "MINNEAPOLIS 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "MOBILE",
              "Value": "MOBILE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "MONTGOMERY",
              "Value": "MONTGOMERY",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "MONTREAL",
              "Value": "MONTREAL",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "NASHVILLE 2",
              "Value": "NASHVILLE 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "NEW ORLEANS",
              "Value": "NEW ORLEANS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "NEWARK",
              "Value": "NEWARK",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "OAKLAND",
              "Value": "OAKLAND",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "OMAHA",
              "Value": "OMAHA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ONTARIO",
              "Value": "ONTARIO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ORANGE COUNTY",
              "Value": "ORANGE COUNTY",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ORLANDO",
              "Value": "ORLANDO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "PHILADELPHIA",
              "Value": "PHILADELPHIA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "PHOENIX",
              "Value": "PHOENIX",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "PITTSBURGH",
              "Value": "PITTSBURGH",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "PORTLAND",
              "Value": "PORTLAND",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "RALEIGH",
              "Value": "RALEIGH",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "RICHMOND",
              "Value": "RICHMOND",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "RICHMOND 2",
              "Value": "RICHMOND 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ROCHESTER2",
              "Value": "ROCHESTER2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SACREMENTO",
              "Value": "SACREMENTO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SALT LAKE CITY",
              "Value": "SALT LAKE CITY",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SAN ANTONIO",
              "Value": "SAN ANTONIO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SAN DIEGO",
              "Value": "SAN DIEGO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SAN FRANCISCO",
              "Value": "SAN FRANCISCO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SAN LUIS OBISPO",
              "Value": "SAN LUIS OBISPO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SANTA BARBARA",
              "Value": "SANTA BARBARA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SEATTLE",
              "Value": "SEATTLE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SHREVEPORT",
              "Value": "SHREVEPORT",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SPOKANE",
              "Value": "SPOKANE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ST. LOUIS",
              "Value": "ST. LOUIS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SUNNYVALE",
              "Value": "SUNNYVALE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "TAMPA",
              "Value": "TAMPA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "TORONTO",
              "Value": "TORONTO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "TUCSON",
              "Value": "TUCSON",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "TULSA",
              "Value": "TULSA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "WASHINGTON DC",
              "Value": "WASHINGTON DC",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "WASHINGTON DC 2",
              "Value": "WASHINGTON DC 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "WICHITA",
              "Value": "WICHITA",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "In Service Area",
        "AttributeDisplayValue": "Yes",
        "AttributeValue": "Yes",
        "PcatDefinition": {
          "Name": "In Service Area",
          "Label": "In Service Area",
          "Type": "Text",
          "Optional": "PreActivation",
          "DefaultValue": "Yes",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> Yes",
              "Value": "Yes",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Intrastate Certification",
        "AttributeDisplayValue": "No",
        "AttributeValue": "No",
        "PcatDefinition": {
          "Name": "Intrastate Certification",
          "Label": "Intrastate Certification",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "No",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> No",
              "Value": "No",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "Yes",
              "Value": "Yes",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Secure Company",
        "AttributeDisplayValue": null,
        "AttributeValue": null,
        "PcatDefinition": {
          "Name": "Secure Company",
          "Label": "Secure Company",
          "Type": "Text",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Customer Number",
        "AttributeDisplayValue": null,
        "AttributeValue": null,
        "PcatDefinition": {
          "Name": "Customer Number",
          "Label": "Customer Number",
          "Type": "Text",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Account Number",
        "AttributeDisplayValue": "2-L3CJPK",
        "AttributeValue": "2-L3CJPK",
        "PcatDefinition": {
          "Name": "Account Number",
          "Label": "Account Number",
          "Type": "Text",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "2-L3CJPK",
              "Value": "2-L3CJPK",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Network Architecture",
        "AttributeDisplayValue": "Metro3",
        "AttributeValue": "Metro3",
        "PcatDefinition": {
          "Name": "Network Architecture",
          "Label": "Network Architecture",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Metro3",
              "Value": "Metro3",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "ECN Enabled",
        "AttributeDisplayValue": "false",
        "AttributeValue": "false",
        "PcatDefinition": {
          "Name": "ECN Enabled",
          "Label": "ECN Enabled",
          "Type": "List",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "false",
              "Value": "false",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Network Color",
        "AttributeDisplayValue": "Not Green",
        "AttributeValue": "Not Green",
        "PcatDefinition": {
          "Name": "Network Color",
          "Label": "Network Color",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "Not Green",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Green",
              "Value": "Green",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "<default> Not Green",
              "Value": "Not Green",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "VPOP",
        "AttributeDisplayValue": "false",
        "AttributeValue": "false",
        "PcatDefinition": {
          "Name": "VPOP",
          "Label": "VPOP",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "false",
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> false",
              "Value": "false",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Term",
        "AttributeDisplayValue": "36",
        "AttributeValue": "36",
        "PcatDefinition": {
          "Name": "Term",
          "Label": "Term",
          "Type": "Integer",
          "Optional": "PreActivation",
          "DefaultValue": "36",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": "{RANGE:1.0:120.0}",
          "DataConstraintValues": {
            "Minimum": 1.0,
            "Maximum": 120.0,
            "DataConstraintType": 1
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "EVC Type",
        "AttributeDisplayValue": null,
        "AttributeValue": null,
        "PcatDefinition": {
          "Name": "EVC Type",
          "Label": "EVC Type",
          "Type": "Relation",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": "Connections.EVC Type",
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "User",
        "AttributeDisplayValue": null,
        "AttributeValue": null,
        "PcatDefinition": {
          "Name": "User",
          "Label": "User",
          "Type": "Text",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": null,
              "Value": null,
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "SourceSystemID",
        "AttributeDisplayValue": null,
        "AttributeValue": null,
        "PcatDefinition": {
          "Name": "SourceSystemID",
          "Label": "SourceSystemID",
          "Type": "Text",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": null,
              "Value": null,
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Petra Pricing",
        "AttributeDisplayValue": "No",
        "AttributeValue": "No",
        "PcatDefinition": {
          "Name": "Petra Pricing",
          "Label": "Petra Pricing",
          "Type": "List",
          "Optional": "None",
          "DefaultValue": "No",
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> No",
              "Value": "No",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Auto Estimate",
        "AttributeDisplayValue": "No",
        "AttributeValue": "No",
        "PcatDefinition": {
          "Name": "Auto Estimate",
          "Label": "Auto Estimate",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "No",
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> No",
              "Value": "No",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Zone Based Pricing",
        "AttributeDisplayValue": "false",
        "AttributeValue": "false",
        "PcatDefinition": {
          "Name": "Zone Based Pricing",
          "Label": "Zone Based Pricing",
          "Type": "Text",
          "Optional": "None",
          "DefaultValue": "false",
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> false",
              "Value": "false",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Lumen Network",
        "AttributeDisplayValue": "Metro 3 Colorless Multitenant NID",
        "AttributeValue": "Metro 3 Colorless Multitenant NID",
        "PcatDefinition": {
          "Name": "Lumen Network",
          "Label": "Lumen Network",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Metro 3 Colorless Multitenant NID",
              "Value": "Metro 3 Colorless Multitenant NID",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Legacy UNI",
        "AttributeDisplayValue": "No",
        "AttributeValue": "No",
        "PcatDefinition": {
          "Name": "Legacy UNI",
          "Label": "Legacy UNI",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "No",
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> No",
              "Value": "No",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Set Solution ID",
        "AttributeDisplayValue": null,
        "AttributeValue": null,
        "PcatDefinition": {
          "Name": "Set Solution ID",
          "Label": "Set Solution ID",
          "Type": "Text",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      }
    ],
    "ProductInfoAttributes": [
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Promotion",
        "AttributeDisplayValue": "Standard Price",
        "AttributeValue": "NONE",
        "PcatDefinition": {
          "Name": null,
          "Label": null,
          "Type": "List",
          "Optional": null,
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": true,
          "MaxRepeats": 0,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": null,
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Standard Price",
              "Value": "NONE",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": null,
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Market",
        "AttributeDisplayValue": "DENVER",
        "AttributeValue": "1057",
        "PcatDefinition": {
          "Name": null,
          "Label": null,
          "Type": "List",
          "Optional": null,
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": true,
          "MaxRepeats": 0,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": null,
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "DENVER",
              "Value": "1057",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": null,
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      }
    ],
    "PriceInfo": {
      "ProductInstanceId": 352951848,
      "TransactionId": 556181595,
      "Action": "Add",
      "Quantity": 1,
      "MrcStandard": 642.2,
      "NrcStandard": 500.0,
      "MrcAdjusted": 642.2,
      "NrcAdjusted": 500.0,
      "MrcDiscount": "0.00",
      "NrcDiscount": "0.00",
      "MrcDiscountType": null,
      "NrcDiscountType": null,
      "RequiresIcb": true,
      "PrepaidMinutes": 0,
      "PriceDetails": [
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Requires ICB because discount is greater than flex policy allows.",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Delivery to the MPoE - Building Extension to customer suite NOT included",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Service Level = 24x7x4",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "No Capital Approval Request needed for this product configuration.",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Port Bandwidth = 1 Gbps",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "This order may require a longer interval of 60 - 90 days.",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Metro Mrc = $388.00, USD",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Metro Nrc = $0.00, USD",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Budgetary Pricing = No",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "[MultiTerm12Used][MultiTerm12Month]",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "[MultiTerm24Used][MultiTerm24Month]",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "[MultiTerm36Used][MultiTerm36Month]",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "[MultiTerm60Used][MultiTerm60Month]",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Original Mrc=$642.2 , USD; Original Nrc=$500 , USD",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "*****  ITEMS BELOW ARE FOR TESTING PURPOSES ONLY  *****",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "MetronEligible=1, GatedQuoteOrder=0",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "DiscountedMrc = 642.2,  StandardMrc = 676",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "TableMrc = 485,  OnNetMrc = 388",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Bandwidth = Not Applicable for On Net Locations,  Port Bandwidth = 1 Gbps",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "AddRedOrOrange=1, AddGreenL=0, AddGreenN=0",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "CTLWireCenter=true, AddNoColorWireCenter=0",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Network Color=Not Green, NetworkColorGreen=0",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "NetStatusChangedToOnNet = 0,Network Status = On Net",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "OnNet=1, AddGreenOnly=0",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "NewInvbdEthernet = 0",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "BuildingCategory = 5",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "BuildingClli = LAB4COZW",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "CARDisplay = 1,  CARRequired = 0",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "RegenSite = false,  AutoAugEth = true",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "ABWCapable = true,  AEthBWCapable = [AEthBWCapable]",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "CatApproval= false,  CARBuilding= 0",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "InvestmentBuilding= false,CATApprovalSimplyOnNet=[CATApprovalSimplyOnNet]",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "CalcBandwidth=1000 Mbps",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Port Bandwidth=1 Gbps",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Audience = Order",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "ServesMultCust= Y,  AddressRegion=NA",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "AddBuildingExtension = ME4",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Inside Wiring = Standard Delivery - To the MPoE (Customer Provided), InsideWiringNA = [InsideWiringNA]",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "AddressRegion=NA,  AddressState=CO",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "PricingIcb=true,WireCenter=[WireCenter]",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "EVC Type=[EVC Type],DefaultSolutionID=[DefaultSolutionID]",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Network Architecture=Metro3",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "FlexPercent=0.5",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "Solution ID=[Solution ID],Set Solution ID = [Set Solution ID]",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "ItemNumber": 0,
          "Description": "ContractedRateMrc=-1,ContractedRateNrc=-1",
          "Quantity": null,
          "UnitMrc": null,
          "UnitNrc": null
        }
      ],
      "UsageDetails": [],
      "CurrencyCode": "USD",
      "MrcApplicable": true,
      "NrcApplicable": true,
      "MrcIsPercentDiscountType": false,
      "NrcIsPercentDiscountType": false,
      "MrcIsAmountDiscountType": true,
      "NrcIsAmountDiscountType": true,
      "MrcDiscountAmount": 0.0,
      "MrcDiscountPercent": 0.0,
      "NrcDiscountAmount": 0.0,
      "NrcDiscountPercent": 0.0
    },
    "Charges": [],
    "ProductKeyAttributes": [
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Product",
        "AttributeDisplayValue": "Fabric Port",
        "AttributeValue": "160",
        "PcatDefinition": {
          "Name": null,
          "Label": null,
          "Type": "Text",
          "Optional": null,
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 0,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": null,
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": null,
          "RequiredElements": null,
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "OverrideMrc",
        "AttributeDisplayValue": "-1",
        "AttributeValue": "-1",
        "PcatDefinition": {
          "Name": "OverrideMrc",
          "Label": "OverrideMrc",
          "Type": "Override",
          "Optional": "None",
          "DefaultValue": "-1",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "OverrideNrc",
        "AttributeDisplayValue": "-1",
        "AttributeValue": "-1",
        "PcatDefinition": {
          "Name": "OverrideNrc",
          "Label": "OverrideNrc",
          "Type": "Override",
          "Optional": "None",
          "DefaultValue": "-1",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Address1",
        "AttributeDisplayValue": null,
        "AttributeValue": "SL0008693604",
        "PcatDefinition": {
          "Name": "Address1",
          "Label": "Address1",
          "Type": "Address",
          "Optional": "PreActivation",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [],
          "RequiredElements": [
            "EthernetCompEnv"
          ],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Opportunity Type",
        "AttributeDisplayValue": "New",
        "AttributeValue": "New",
        "PcatDefinition": {
          "Name": "Opportunity Type",
          "Label": "Opportunity Type",
          "Type": "List",
          "Optional": "None",
          "DefaultValue": "New",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> New",
              "Value": "New",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "CPT",
        "AttributeDisplayValue": "CSP3",
        "AttributeValue": "CSP3",
        "PcatDefinition": {
          "Name": "CPT",
          "Label": "Pricing Tier",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "CSP3",
              "Value": "CSP3",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Flex",
        "AttributeDisplayValue": "CSP",
        "AttributeValue": "CSP",
        "PcatDefinition": {
          "Name": null,
          "Label": null,
          "Type": "List",
          "Optional": null,
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 0,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": null,
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "CSP",
              "Value": "CSP",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": null,
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Network Status",
        "AttributeDisplayValue": "On Net",
        "AttributeValue": "On Net",
        "PcatDefinition": {
          "Name": "Network Status",
          "Label": "Network Status",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "On Net",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Off Net",
              "Value": "Off Net",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "<default> On Net",
              "Value": "On Net",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Port Bandwidth",
        "AttributeDisplayValue": "1 Gbps",
        "AttributeValue": "1000 Mbps",
        "PcatDefinition": {
          "Name": "Port Bandwidth",
          "Label": "Port Bandwidth",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "1 Gbps",
              "Value": "1000 Mbps",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "10 Gbps",
              "Value": "10000 Mbps",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "High Bandwidth",
        "AttributeDisplayValue": "No",
        "AttributeValue": "No",
        "PcatDefinition": {
          "Name": "High Bandwidth",
          "Label": "Full Port Speed",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "No",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> No",
              "Value": "No",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Bandwidth",
        "AttributeDisplayValue": "Not Applicable for On Net Locations",
        "AttributeValue": "Not Applicable for On Net Locations",
        "PcatDefinition": {
          "Name": "Bandwidth",
          "Label": "Bandwidth",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "Not Applicable for On Net Locations",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> Not Applicable for On Net Locations",
              "Value": "Not Applicable for On Net Locations",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Intent",
        "AttributeDisplayValue": "NaaS",
        "AttributeValue": "NaaS",
        "PcatDefinition": {
          "Name": "Intent",
          "Label": "Intent",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "NaaS",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Ethernet",
              "Value": "Ethernet",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "<default> NaaS (IoD or EoD)",
              "Value": "NaaS",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "UNI Type",
        "AttributeDisplayValue": "Multiplexed",
        "AttributeValue": "Multiplexed",
        "PcatDefinition": {
          "Name": "UNI Type",
          "Label": "UNI Type",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "Multiplexed",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> Multiplexed",
              "Value": "Multiplexed",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "3rd Party Cross Connect",
        "AttributeDisplayValue": "No",
        "AttributeValue": "No",
        "PcatDefinition": {
          "Name": "3rd Party Cross Connect",
          "Label": "3rd Party Cross Connect",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "No",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> No",
              "Value": "No",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "Yes",
              "Value": "Yes",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Cloud Provider",
        "AttributeDisplayValue": "N/A",
        "AttributeValue": "N/A",
        "PcatDefinition": {
          "Name": "Cloud Provider",
          "Label": "Cloud Provider",
          "Type": "List",
          "Optional": "None",
          "DefaultValue": "N/A",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> N/A",
              "Value": "N/A",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Inside Wiring",
        "AttributeDisplayValue": "Standard Delivery - To the MPoE (Customer Provided)",
        "AttributeValue": "Standard Delivery - To the MPoE (Customer Provided)",
        "PcatDefinition": {
          "Name": "Inside Wiring",
          "Label": "Building Extension",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Extended Delivery - To the Customer Suite (Lumen Provided)",
              "Value": "Extended Delivery - To the Customer Suite (Level 3 Provided)",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "Standard Delivery - To the MPoE (Customer Provided)",
              "Value": "Standard Delivery - To the MPoE (Customer Provided)",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "IP Pop",
        "AttributeDisplayValue": "DENVER",
        "AttributeValue": "DENVER",
        "PcatDefinition": {
          "Name": "IP Pop",
          "Label": "IP Pop",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "DENVER",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "ALBANY",
              "Value": "ALBANY",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ALBUQUERQUE",
              "Value": "ALBUQUERQUE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ASHBURN",
              "Value": "ASHBURN",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ATLANTA",
              "Value": "ATLANTA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "AUSTIN",
              "Value": "AUSTIN",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BAKERSFIELD",
              "Value": "BAKERSFIELD",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BALTIMORE",
              "Value": "BALTIMORE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BATON ROUGE",
              "Value": "BATON ROUGE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BILLINGS",
              "Value": "BILLINGS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BINGHAMTON",
              "Value": "BINGHAMTON",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BIRMINGHAM",
              "Value": "BIRMINGHAM",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BOISE 2",
              "Value": "BOISE 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BOSTON 2",
              "Value": "BOSTON 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BROOKFIELD",
              "Value": "BROOKFIELD",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "BURLINGTON",
              "Value": "BURLINGTON",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "CHARLOTTE",
              "Value": "CHARLOTTE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "CHARLOTTESVILLE",
              "Value": "CHARLOTTESVILLE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "CHICAGO",
              "Value": "CHICAGO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "CINCINNATI",
              "Value": "CINCINNATI",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "CLEVELAND",
              "Value": "CLEVELAND",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "COLORADO SPRINGS",
              "Value": "COLORADO SPRINGS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "COLUMBIA",
              "Value": "COLUMBIA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "COLUMBUS",
              "Value": "COLUMBUS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "COLUMBUS 2",
              "Value": "COLUMBUS 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "COLUMBUS GA",
              "Value": "COLUMBUS GA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "DALLAS",
              "Value": "DALLAS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "DAYTON",
              "Value": "DAYTON",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "<default> DENVER",
              "Value": "DENVER",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "DES MOINES",
              "Value": "DES MOINES",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "DETROIT",
              "Value": "DETROIT",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "EL PASO",
              "Value": "EL PASO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "FAYETTEVILLE",
              "Value": "FAYETTEVILLE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "FORT MYERS",
              "Value": "FORT MYERS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "FORT WORTH",
              "Value": "FORT WORTH",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "FRESNO",
              "Value": "FRESNO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "FT. LAUDERDALE",
              "Value": "FT. LAUDERDALE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "FT. WORTH",
              "Value": "FT. WORTH",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "GREENSBORO",
              "Value": "GREENSBORO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "GREENVILLE",
              "Value": "GREENVILLE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "HARRISBURG",
              "Value": "HARRISBURG",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "HONOLULU 2",
              "Value": "HONOLULU 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "HOUSTON",
              "Value": "HOUSTON",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "HUNTSVILLE",
              "Value": "HUNTSVILLE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "INDIANAPOLIS",
              "Value": "INDIANAPOLIS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "INLAND EMPIRE",
              "Value": "INLAND EMPIRE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "JACKSONVILLE",
              "Value": "JACKSONVILLE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "JERSEY CITY",
              "Value": "JERSEY CITY",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "KANSAS CITY",
              "Value": "KANSAS CITY",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "LAKE CHARLES",
              "Value": "LAKE CHARLES",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "LAS VEGAS",
              "Value": "LAS VEGAS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "LEXINGTON",
              "Value": "LEXINGTON",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "LITTLE ROCK",
              "Value": "LITTLE ROCK",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "LOS ANGELES",
              "Value": "LOS ANGELES",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "LOUISVILLE2",
              "Value": "LOUISVILLE2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "MANHATTAN",
              "Value": "MANHATTAN",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "MEMPHIS",
              "Value": "MEMPHIS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "MILWAUKEE",
              "Value": "MILWAUKEE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "MINNEAPOLIS 2",
              "Value": "MINNEAPOLIS 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "MOBILE",
              "Value": "MOBILE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "MONTGOMERY",
              "Value": "MONTGOMERY",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "MONTREAL",
              "Value": "MONTREAL",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "NASHVILLE 2",
              "Value": "NASHVILLE 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "NEW ORLEANS",
              "Value": "NEW ORLEANS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "NEWARK",
              "Value": "NEWARK",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "OAKLAND",
              "Value": "OAKLAND",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "OMAHA",
              "Value": "OMAHA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ONTARIO",
              "Value": "ONTARIO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ORANGE COUNTY",
              "Value": "ORANGE COUNTY",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ORLANDO",
              "Value": "ORLANDO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "PHILADELPHIA",
              "Value": "PHILADELPHIA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "PHOENIX",
              "Value": "PHOENIX",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "PITTSBURGH",
              "Value": "PITTSBURGH",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "PORTLAND",
              "Value": "PORTLAND",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "RALEIGH",
              "Value": "RALEIGH",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "RICHMOND",
              "Value": "RICHMOND",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "RICHMOND 2",
              "Value": "RICHMOND 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ROCHESTER2",
              "Value": "ROCHESTER2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SACREMENTO",
              "Value": "SACREMENTO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SALT LAKE CITY",
              "Value": "SALT LAKE CITY",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SAN ANTONIO",
              "Value": "SAN ANTONIO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SAN DIEGO",
              "Value": "SAN DIEGO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SAN FRANCISCO",
              "Value": "SAN FRANCISCO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SAN LUIS OBISPO",
              "Value": "SAN LUIS OBISPO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SANTA BARBARA",
              "Value": "SANTA BARBARA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SEATTLE",
              "Value": "SEATTLE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SHREVEPORT",
              "Value": "SHREVEPORT",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SPOKANE",
              "Value": "SPOKANE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "ST. LOUIS",
              "Value": "ST. LOUIS",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "SUNNYVALE",
              "Value": "SUNNYVALE",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "TAMPA",
              "Value": "TAMPA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "TORONTO",
              "Value": "TORONTO",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "TUCSON",
              "Value": "TUCSON",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "TULSA",
              "Value": "TULSA",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "WASHINGTON DC",
              "Value": "WASHINGTON DC",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "WASHINGTON DC 2",
              "Value": "WASHINGTON DC 2",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "WICHITA",
              "Value": "WICHITA",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "In Service Area",
        "AttributeDisplayValue": "Yes",
        "AttributeValue": "Yes",
        "PcatDefinition": {
          "Name": "In Service Area",
          "Label": "In Service Area",
          "Type": "Text",
          "Optional": "PreActivation",
          "DefaultValue": "Yes",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> Yes",
              "Value": "Yes",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Intrastate Certification",
        "AttributeDisplayValue": "No",
        "AttributeValue": "No",
        "PcatDefinition": {
          "Name": "Intrastate Certification",
          "Label": "Intrastate Certification",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "No",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> No",
              "Value": "No",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "Yes",
              "Value": "Yes",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Secure Company",
        "AttributeDisplayValue": null,
        "AttributeValue": null,
        "PcatDefinition": {
          "Name": "Secure Company",
          "Label": "Secure Company",
          "Type": "Text",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Customer Number",
        "AttributeDisplayValue": null,
        "AttributeValue": null,
        "PcatDefinition": {
          "Name": "Customer Number",
          "Label": "Customer Number",
          "Type": "Text",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Account Number",
        "AttributeDisplayValue": "2-L3CJPK",
        "AttributeValue": "2-L3CJPK",
        "PcatDefinition": {
          "Name": "Account Number",
          "Label": "Account Number",
          "Type": "Text",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "2-L3CJPK",
              "Value": "2-L3CJPK",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Network Architecture",
        "AttributeDisplayValue": "Metro3",
        "AttributeValue": "Metro3",
        "PcatDefinition": {
          "Name": "Network Architecture",
          "Label": "Network Architecture",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Metro3",
              "Value": "Metro3",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "ECN Enabled",
        "AttributeDisplayValue": "false",
        "AttributeValue": "false",
        "PcatDefinition": {
          "Name": "ECN Enabled",
          "Label": "ECN Enabled",
          "Type": "List",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "false",
              "Value": "false",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Network Color",
        "AttributeDisplayValue": "Not Green",
        "AttributeValue": "Not Green",
        "PcatDefinition": {
          "Name": "Network Color",
          "Label": "Network Color",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "Not Green",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Green",
              "Value": "Green",
              "ID": null,
              "NumericEquivelent": null
            },
            {
              "DisplayValue": "<default> Not Green",
              "Value": "Not Green",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "VPOP",
        "AttributeDisplayValue": "false",
        "AttributeValue": "false",
        "PcatDefinition": {
          "Name": "VPOP",
          "Label": "VPOP",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "false",
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> false",
              "Value": "false",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Term",
        "AttributeDisplayValue": "36",
        "AttributeValue": "36",
        "PcatDefinition": {
          "Name": "Term",
          "Label": "Term",
          "Type": "Integer",
          "Optional": "PreActivation",
          "DefaultValue": "36",
          "OtherAttributeName": null,
          "Enable": true,
          "Visible": true,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": "{RANGE:1.0:120.0}",
          "DataConstraintValues": {
            "Minimum": 1.0,
            "Maximum": 120.0,
            "DataConstraintType": 1
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "EVC Type",
        "AttributeDisplayValue": null,
        "AttributeValue": null,
        "PcatDefinition": {
          "Name": "EVC Type",
          "Label": "EVC Type",
          "Type": "Relation",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": "Connections.EVC Type",
          "Enable": true,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "User",
        "AttributeDisplayValue": null,
        "AttributeValue": null,
        "PcatDefinition": {
          "Name": "User",
          "Label": "User",
          "Type": "Text",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": null,
              "Value": null,
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "SourceSystemID",
        "AttributeDisplayValue": null,
        "AttributeValue": null,
        "PcatDefinition": {
          "Name": "SourceSystemID",
          "Label": "SourceSystemID",
          "Type": "Text",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": null,
              "Value": null,
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Petra Pricing",
        "AttributeDisplayValue": "No",
        "AttributeValue": "No",
        "PcatDefinition": {
          "Name": "Petra Pricing",
          "Label": "Petra Pricing",
          "Type": "List",
          "Optional": "None",
          "DefaultValue": "No",
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> No",
              "Value": "No",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Auto Estimate",
        "AttributeDisplayValue": "No",
        "AttributeValue": "No",
        "PcatDefinition": {
          "Name": "Auto Estimate",
          "Label": "Auto Estimate",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "No",
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> No",
              "Value": "No",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Zone Based Pricing",
        "AttributeDisplayValue": "false",
        "AttributeValue": "false",
        "PcatDefinition": {
          "Name": "Zone Based Pricing",
          "Label": "Zone Based Pricing",
          "Type": "Text",
          "Optional": "None",
          "DefaultValue": "false",
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> false",
              "Value": "false",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Lumen Network",
        "AttributeDisplayValue": "Metro 3 Colorless Multitenant NID",
        "AttributeValue": "Metro 3 Colorless Multitenant NID",
        "PcatDefinition": {
          "Name": "Lumen Network",
          "Label": "Lumen Network",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Metro 3 Colorless Multitenant NID",
              "Value": "Metro 3 Colorless Multitenant NID",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Legacy UNI",
        "AttributeDisplayValue": "No",
        "AttributeValue": "No",
        "PcatDefinition": {
          "Name": "Legacy UNI",
          "Label": "Legacy UNI",
          "Type": "List",
          "Optional": "PreActivation",
          "DefaultValue": "No",
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "<default> No",
              "Value": "No",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": [],
          "RestartWorkflow": true
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Promotion",
        "AttributeDisplayValue": "Standard Price",
        "AttributeValue": "NONE",
        "PcatDefinition": {
          "Name": null,
          "Label": null,
          "Type": "List",
          "Optional": null,
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": true,
          "MaxRepeats": 0,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": null,
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Standard Price",
              "Value": "NONE",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": null,
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Market",
        "AttributeDisplayValue": "DENVER",
        "AttributeValue": "1057",
        "PcatDefinition": {
          "Name": null,
          "Label": null,
          "Type": "List",
          "Optional": null,
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": true,
          "MaxRepeats": 0,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": null,
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "DENVER",
              "Value": "1057",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": null,
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Set Solution ID",
        "AttributeDisplayValue": null,
        "AttributeValue": null,
        "PcatDefinition": {
          "Name": "Set Solution ID",
          "Label": "Set Solution ID",
          "Type": "Text",
          "Optional": "None",
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 1,
          "Mask": "",
          "DataConstraint": null,
          "DataConstraintValues": {
            "Minimum": -79228162514264300000000000000.0,
            "Maximum": 79228162514264300000000000000.0,
            "DataConstraintType": 0
          },
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [],
          "RequiredElements": [],
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": true,
        "UserModified": false
      }
    ],
    "Properties": [
      {
        "Action": "Add",
        "TransactionId": 556181595,
        "PropertyName": "Promotion_Code",
        "PropertyValue": "NONE",
        "ProductInstanceId": 352951848,
        "IsProductPropertyUpdated": false
      },
      {
        "Action": "Add",
        "TransactionId": 556181595,
        "PropertyName": "Account_Number",
        "PropertyValue": "304254",
        "ProductInstanceId": 352951848,
        "IsProductPropertyUpdated": false
      },
      {
        "Action": "Add",
        "TransactionId": 556181595,
        "PropertyName": "Kenan_BAN",
        "PropertyValue": "5-SCDKVVQ3",
        "ProductInstanceId": 352951848,
        "IsProductPropertyUpdated": false
      },
      {
        "Action": "Add",
        "TransactionId": 556181595,
        "PropertyName": "Invoice_Display_BAN",
        "PropertyValue": "304254",
        "ProductInstanceId": 352951848,
        "IsProductPropertyUpdated": false
      }
    ],
    "RelatedNumbers": [],
    "AvailableRelationship": [
      {
        "Name": "Connections",
        "Products": [
          159,
          237,
          518
        ],
        "Mininum": 0,
        "Maximun": 500,
        "Address": "",
        "ProductAttributeFilter": {
          "CurrentProduct": null,
          "RelatedProduct": null,
          "Comparison": "|",
          "Filter1": {
            "CurrentProduct": {
              "Name": "Address1",
              "Type": "Address",
              "Element": ""
            },
            "RelatedProduct": {
              "Name": "Address1",
              "Type": "Address",
              "Element": ""
            },
            "Comparison": "=",
            "Filter1": null,
            "Filter2": null
          },
          "Filter2": {
            "CurrentProduct": {
              "Name": "Address1",
              "Type": "Address",
              "Element": ""
            },
            "RelatedProduct": {
              "Name": "Address2",
              "Type": "Address",
              "Element": ""
            },
            "Comparison": "=",
            "Filter1": null,
            "Filter2": null
          }
        },
        "AdditionalFilteringRule": "Customer Number=Customer Number",
        "UserCanAssign": false
      }
    ],
    "EditableRelationship": [],
    "MissedMandatoryRelationship": [],
    "MandatoryRelationship": [],
    "OptionalRelationship": [
      {
        "Name": "Connections",
        "Products": [
          159,
          237,
          518
        ],
        "Mininum": 0,
        "Maximun": 500,
        "Address": "",
        "ProductAttributeFilter": {
          "CurrentProduct": null,
          "RelatedProduct": null,
          "Comparison": "|",
          "Filter1": {
            "CurrentProduct": {
              "Name": "Address1",
              "Type": "Address",
              "Element": ""
            },
            "RelatedProduct": {
              "Name": "Address1",
              "Type": "Address",
              "Element": ""
            },
            "Comparison": "=",
            "Filter1": null,
            "Filter2": null
          },
          "Filter2": {
            "CurrentProduct": {
              "Name": "Address1",
              "Type": "Address",
              "Element": ""
            },
            "RelatedProduct": {
              "Name": "Address2",
              "Type": "Address",
              "Element": ""
            },
            "Comparison": "=",
            "Filter1": null,
            "Filter2": null
          }
        },
        "AdditionalFilteringRule": "Customer Number=Customer Number",
        "UserCanAssign": false
      }
    ],
    "BundlePackage": null,
    "IsProductKeyAdded": false,
    "IsProductKeyRemoved": false,
    "IsProductKeyCancelled": false,
    "IsProductKeyDisconnect": false,
    "IsProductKeyUpdated": false,
    "OriginalTransactionId": 0,
    "CurrencyCode": "USD",
    "ActionDisplayValue": null,
    "GPId": null,
    "CanAddProductKey": false,
    "UnableToAddMessage": null,
    "RootProductInstanceId": 352951848,
    "ParentProductInstanceId": 352951848,
    "IsChangeFlag": false,
    "IsFirstAppearance": false,
    "AllowOverrideMrc": false,
    "AllowOverrideNrc": false,
    "AllowOverrideYrc": false,
    "DisableProductPrices": false,
    "RoutingGroupOverride": null,
    "VendorAddressCorrelationId": null,
    "VendorAddressType": null,
    "VendorAddressStreetNumberDirectionalPrefix": null,
    "VendorAddressStreetNumberDirectionalSuffix": null,
    "VendorAddressStreetNameDirectionalPrefix": null,
    "VendorAddressStreetNameDirectionalSuffix": null,
    "VendorAddressLocationTypeOne": null,
    "VendorAddressLocationTypeTwo": null,
    "VendorAddressLocationTypeThree": null,
    "VendorAddressLocationDetailsOne": null,
    "VendorAddressLocationDetailsTwo": null,
    "VendorAddressLocationDetailsThree": null,
    "VendorAddressStreetName": null,
    "VendorAddressStreetNumber": null,
    "VendorAddressStreetType": null,
    "VendorAddressCity": null,
    "VendorAddressState": null,
    "VendorAddressZipCode": null,
    "VendorAddressBypassValidationReason": null,
    "VendorAddressBypassValidationFlag": null,
    "SpaceCode": null,
    "Mrc": 642.2,
    "Nrc": 500.0,
    "Yrc": {
      "ProductInstanceId": 352951848,
      "TransactionId": 556181595,
      "Name": "Fabric Port",
      "Action": "Add",
      "AmountStandard": 0.0,
      "AmountDiscount": 0.0,
      "AmountAdjusted": 0.0,
      "AllowOveride": false,
      "OverrideAttribute": null,
      "Frequency": {
        "name": "YRC",
        "description": "Annually Recurring Charge",
        "frequencyId": 3
      },
      "SuperUserOverride": false,
      "ToolTip": null,
      "AmortizedAmount": 0.0,
      "AmortizedTerm": 0.0,
      "PercentAmortized": 0.0,
      "DiscountPercent": 0.0
    },
    "MissedMandatoryRelatedProducts": [],
    "OptionalRelatedProductBtnHolder": {
      "ProductInstanceId": 0,
      "RelationshipName": null,
      "RelatedProductInstanceId": 0,
      "RelatedGlobalProductId": null,
      "TransactionId": 0,
      "RelatedProductTransactionId": 0,
      "Action": null,
      "RelatedRelationshipName": null,
      "Status": null,
      "RelatedProductId": 0,
      "ProductPackageId": 0,
      "RelatedProductPackageId": 0,
      "RelatedGlobalPackageId": null,
      "RelatedProductName": null,
      "RelatedProductServiceAlias": null,
      "IsMandatoryRelatedProduct": false,
      "UserCanAssign": false,
      "IsNoLongerValid": false,
      "RelatedPcatProductId": 0,
      "UserCanSever": null
    },
    "PromotionAttribute": {
      "ProductInstanceId": 352951848,
      "TransactionId": 556181595,
      "Action": "Add",
      "AttributeName": "Promotion",
      "AttributeDisplayValue": "Standard Price",
      "AttributeValue": "NONE",
      "PcatDefinition": {
        "Name": null,
        "Label": null,
        "Type": "List",
        "Optional": null,
        "DefaultValue": null,
        "OtherAttributeName": null,
        "Enable": false,
        "Visible": true,
        "MaxRepeats": 0,
        "Mask": null,
        "DataConstraint": null,
        "DataConstraintValues": null,
        "InternalOnly": false,
        "ComplexType": 0,
        "IsValid": true,
        "RequiresRefresh": false,
        "ErrorString": null,
        "NetCrackerId": null,
        "AffectsLinkedAttributes": false,
        "LinkedAttribute": null,
        "Values": [
          {
            "DisplayValue": "Standard Price",
            "Value": "NONE",
            "ID": null,
            "NumericEquivelent": null
          }
        ],
        "RequiredElements": null,
        "RestartWorkflow": false
      },
      "AttributeId": null,
      "AttributeNumericEquivalent": 0.0,
      "Deleted": false,
      "IsRequired": false,
      "ApplicableForChange": false,
      "UserModified": false
    },
    "IsAsrVendorAddressVisible": false,
    "IsProductKeyRelatedNumbersModified": false,
    "IsForceModify": false,
    "OpenExistingAccountPageUrl": "http://am-test1/AMWeb/BillingAccount/Details/",
    "AmortizedTerm": 0.0,
    "AmortizedAmount": 0.0,
    "PercentAmortized": 0.0
  },
  "OnNet": true,
  "PartnerSource": null,
  "ChannelProgram": null,
  "CoordinatedHotCutTime": null,
  "ContractExpirationDate": null,
  "CustomerId": null,
  "IsProductPackageInfoUpdated": false,
  "IsProductPackageMarkedCancelOrRemoval": false,
  "ProductPackageCancelOrRemovalReason": null,
  "CurrencyCode": "USD",
  "GPId": "464259129",
  "HasHotCutAttribute": false,
  "IsThereLiveTraffic": null,
  "ExistingServiceId": null,
  "RoutingGroup": "SEO - eProducts",
  "DesignLayoutRecord": null,
  "HasOverlappingService": false,
  "DeliveryRegionCode": "NA",
  "VrfId": null,
  "ExpediteType": null,
  "OrderingSystem": "SwIFT",
  "IsProductPackageUpdated": false,
  "SpaceCode": null,
  "HierarchyAltered": "3/23/2026 3:12:23 PM",
  "IsSwiftInventory": true,
  "IsCoordinated": false,
  "NG911": false,
  "Express": null,
  "NG911PSAPID": null,
  "LoaCfa": false,
  "NetworkStatus": "On Net",
  "Market": "DENVER",
  "DisplayServiceAddress": "5325 ZUNI ST DENVER COLORADO 80221 1499 UNITED STATES, Floor 5 Room WLAB",
  "IsRelatedNumberUpdated": false,
  "IsProductKeyUpdated": false,
  "IsProductKeyRelatedNumbersUpdated": false,
  "IsProductPackagePropertyUpdated": false,
  "IsServiceAddressUpdated": false,
  "ChildProductKeys": [
    {
      "ProductInstanceId": 352951849,
      "ProductPackageId": 464259129,
      "TransactionId": 556181595,
      "ProductId": 284,
      "IsParentProduct": false,
      "Action": "Add",
      "RequestedDueDate": null,
      "RequestedDueDateTimeZone": null,
      "PriceInfoId": 0,
      "MarketId": 1057,
      "PcatVersion": "23-Mar-26",
      "GroupingType": null,
      "EffectiveBillDate": "1/1/0001 12:00:00 AM",
      "ProductName": "Dynamic Connections",
      "AccountNumber": 304254,
      "KenanBAN": "5-SCDKVVQ3",
      "InvoiceDisplayBAN": "304254",
      "LexmBAN": null,
      "PromotionCode": "NONE",
      "IsExistingProduct": "No",
      "ProductCategory": null,
      "BanSelect": false,
      "ProductAttributes": [
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "CPT",
          "AttributeDisplayValue": "CSP3",
          "AttributeValue": "CSP3",
          "PcatDefinition": {
            "Name": "CPT",
            "Label": "Pricing Tier",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264337593543950335.0,
              "Maximum": 79228162514264337593543950335.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "CSP3",
                "Value": "CSP3",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Intent",
          "AttributeDisplayValue": "NaaS (IoD or EoD)",
          "AttributeValue": "NaaS",
          "PcatDefinition": {
            "Name": "Intent",
            "Label": "Intent",
            "Type": "Parent",
            "Optional": "PreActivation",
            "DefaultValue": "Ethernet",
            "OtherAttributeName": "",
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264337593543950335.0,
              "Maximum": 79228162514264337593543950335.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "NaaS (IoD or EoD)",
                "Value": "NaaS",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "ParentID",
          "AttributeDisplayValue": "160",
          "AttributeValue": "160",
          "PcatDefinition": {
            "Name": "ParentID",
            "Label": "ParentID",
            "Type": "Parent",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": "Product",
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264337593543950335.0,
              "Maximum": 79228162514264337593543950335.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "160",
                "Value": "160",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        }
      ],
      "ProductInfoAttributes": [
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Promotion",
          "AttributeDisplayValue": "NONE",
          "AttributeValue": "NONE",
          "PcatDefinition": {
            "Name": null,
            "Label": null,
            "Type": "Text",
            "Optional": null,
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 0,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": null,
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": false,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": null,
            "RequiredElements": null,
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        }
      ],
      "PriceInfo": {
        "ProductInstanceId": 352951849,
        "TransactionId": 556181595,
        "Action": "Add",
        "Quantity": 1,
        "MrcStandard": 0.0,
        "NrcStandard": 0.0,
        "MrcAdjusted": 0.0,
        "NrcAdjusted": 0.0,
        "MrcDiscount": "0%",
        "NrcDiscount": "0%",
        "MrcDiscountType": null,
        "NrcDiscountType": null,
        "RequiresIcb": false,
        "PrepaidMinutes": 0,
        "PriceDetails": [],
        "UsageDetails": [],
        "CurrencyCode": "USD",
        "MrcApplicable": false,
        "NrcApplicable": true,
        "MrcIsPercentDiscountType": false,
        "NrcIsPercentDiscountType": false,
        "MrcIsAmountDiscountType": true,
        "NrcIsAmountDiscountType": true,
        "MrcDiscountAmount": 0.0,
        "MrcDiscountPercent": 0.0,
        "NrcDiscountAmount": 0.0,
        "NrcDiscountPercent": 0.0
      },
      "Charges": [],
      "ProductKeyAttributes": [
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "CPT",
          "AttributeDisplayValue": "CSP3",
          "AttributeValue": "CSP3",
          "PcatDefinition": {
            "Name": "CPT",
            "Label": "Pricing Tier",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264337593543950335.0,
              "Maximum": 79228162514264337593543950335.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "CSP3",
                "Value": "CSP3",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Intent",
          "AttributeDisplayValue": "NaaS (IoD or EoD)",
          "AttributeValue": "NaaS",
          "PcatDefinition": {
            "Name": "Intent",
            "Label": "Intent",
            "Type": "Parent",
            "Optional": "PreActivation",
            "DefaultValue": "Ethernet",
            "OtherAttributeName": "",
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264337593543950335.0,
              "Maximum": 79228162514264337593543950335.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "NaaS (IoD or EoD)",
                "Value": "NaaS",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "ParentID",
          "AttributeDisplayValue": "160",
          "AttributeValue": "160",
          "PcatDefinition": {
            "Name": "ParentID",
            "Label": "ParentID",
            "Type": "Parent",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": "Product",
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264337593543950335.0,
              "Maximum": 79228162514264337593543950335.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "160",
                "Value": "160",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Promotion",
          "AttributeDisplayValue": "NONE",
          "AttributeValue": "NONE",
          "PcatDefinition": {
            "Name": null,
            "Label": null,
            "Type": "Text",
            "Optional": null,
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 0,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": null,
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": false,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": null,
            "RequiredElements": null,
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Product",
          "AttributeDisplayValue": "Dynamic Connections",
          "AttributeValue": "284",
          "PcatDefinition": {
            "Name": null,
            "Label": null,
            "Type": "Text",
            "Optional": null,
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 0,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": null,
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": false,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": null,
            "RequiredElements": null,
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        }
      ],
      "Properties": [
        {
          "Action": "Add",
          "TransactionId": 556181595,
          "PropertyName": "Promotion_Code",
          "PropertyValue": "NONE",
          "ProductInstanceId": 352951849,
          "IsProductPropertyUpdated": false
        },
        {
          "Action": "Add",
          "TransactionId": 556181595,
          "PropertyName": "Account_Number",
          "PropertyValue": "304254",
          "ProductInstanceId": 352951849,
          "IsProductPropertyUpdated": false
        },
        {
          "Action": "Add",
          "TransactionId": 556181595,
          "PropertyName": "Kenan_BAN",
          "PropertyValue": "5-SCDKVVQ3",
          "ProductInstanceId": 352951849,
          "IsProductPropertyUpdated": false
        },
        {
          "Action": "Add",
          "TransactionId": 556181595,
          "PropertyName": "Invoice_Display_BAN",
          "PropertyValue": "304254",
          "ProductInstanceId": 352951849,
          "IsProductPropertyUpdated": false
        }
      ],
      "RelatedNumbers": [],
      "AvailableRelationship": [],
      "EditableRelationship": [],
      "MissedMandatoryRelationship": [],
      "MandatoryRelationship": [],
      "OptionalRelationship": [],
      "BundlePackage": null,
      "IsProductKeyAdded": false,
      "IsProductKeyRemoved": false,
      "IsProductKeyCancelled": false,
      "IsProductKeyDisconnect": false,
      "IsProductKeyUpdated": false,
      "OriginalTransactionId": 0,
      "CurrencyCode": "USD",
      "ActionDisplayValue": null,
      "GPId": null,
      "CanAddProductKey": false,
      "UnableToAddMessage": null,
      "RootProductInstanceId": 352951848,
      "ParentProductInstanceId": 352951848,
      "IsChangeFlag": false,
      "IsFirstAppearance": false,
      "AllowOverrideMrc": false,
      "AllowOverrideNrc": false,
      "AllowOverrideYrc": false,
      "DisableProductPrices": false,
      "RoutingGroupOverride": null,
      "VendorAddressCorrelationId": null,
      "VendorAddressType": null,
      "VendorAddressStreetNumberDirectionalPrefix": null,
      "VendorAddressStreetNumberDirectionalSuffix": null,
      "VendorAddressStreetNameDirectionalPrefix": null,
      "VendorAddressStreetNameDirectionalSuffix": null,
      "VendorAddressLocationTypeOne": null,
      "VendorAddressLocationTypeTwo": null,
      "VendorAddressLocationTypeThree": null,
      "VendorAddressLocationDetailsOne": null,
      "VendorAddressLocationDetailsTwo": null,
      "VendorAddressLocationDetailsThree": null,
      "VendorAddressStreetName": null,
      "VendorAddressStreetNumber": null,
      "VendorAddressStreetType": null,
      "VendorAddressCity": null,
      "VendorAddressState": null,
      "VendorAddressZipCode": null,
      "VendorAddressBypassValidationReason": null,
      "VendorAddressBypassValidationFlag": null,
      "SpaceCode": null,
      "Mrc": 0.0,
      "Nrc": 0.0,
      "Yrc": {
        "ProductInstanceId": 352951849,
        "TransactionId": 556181595,
        "Name": "Dynamic Connections",
        "Action": "Add",
        "AmountStandard": 0.0,
        "AmountDiscount": 0.0,
        "AmountAdjusted": 0.0,
        "AllowOveride": false,
        "OverrideAttribute": null,
        "Frequency": {
          "name": "YRC",
          "description": "Annually Recurring Charge",
          "frequencyId": 3
        },
        "SuperUserOverride": false,
        "ToolTip": null,
        "AmortizedAmount": 0.0,
        "AmortizedTerm": 0.0,
        "PercentAmortized": 0.0,
        "DiscountPercent": 0.0
      },
      "MissedMandatoryRelatedProducts": [],
      "OptionalRelatedProductBtnHolder": {
        "ProductInstanceId": 0,
        "RelationshipName": null,
        "RelatedProductInstanceId": 0,
        "RelatedGlobalProductId": null,
        "TransactionId": 0,
        "RelatedProductTransactionId": 0,
        "Action": null,
        "RelatedRelationshipName": null,
        "Status": null,
        "RelatedProductId": 0,
        "ProductPackageId": 0,
        "RelatedProductPackageId": 0,
        "RelatedGlobalPackageId": null,
        "RelatedProductName": null,
        "RelatedProductServiceAlias": null,
        "IsMandatoryRelatedProduct": false,
        "UserCanAssign": false,
        "IsNoLongerValid": false,
        "RelatedPcatProductId": 0,
        "UserCanSever": null
      },
      "PromotionAttribute": {
        "ProductInstanceId": 352951849,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Promotion",
        "AttributeDisplayValue": "NONE",
        "AttributeValue": "NONE",
        "PcatDefinition": {
          "Name": null,
          "Label": null,
          "Type": "Text",
          "Optional": null,
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 0,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": null,
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": false,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": null,
          "RequiredElements": null,
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      "IsAsrVendorAddressVisible": false,
      "IsProductKeyRelatedNumbersModified": false,
      "IsForceModify": false,
      "OpenExistingAccountPageUrl": "http://am-test1/AMWeb/BillingAccount/Details/",
      "AmortizedTerm": 0.0,
      "AmortizedAmount": 0.0,
      "PercentAmortized": 0.0
    }
  ],
  "IsBpmsRoute": false,
  "BasicTrueFalseProductPackageDetails": [
    {
      "ProductPackageDetailValues": 0,
      "PropertyNameInPropertiesCollection": "IsExpedited",
      "PropertyNameFromDomainObject": "IsExpedited",
      "UiLabel": null,
      "TypeId": "Swift.Domain.Customer.Product.Attributes.ProductPackageDetailAttribute, Swift.Domain, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"
    },
    {
      "ProductPackageDetailValues": 0,
      "PropertyNameInPropertiesCollection": "NG911",
      "PropertyNameFromDomainObject": "NG911",
      "UiLabel": "NG911",
      "TypeId": "Swift.Domain.Customer.Product.Attributes.ProductPackageDetailAttribute, Swift.Domain, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"
    },
    {
      "ProductPackageDetailValues": 0,
      "PropertyNameInPropertiesCollection": "Is_Coordinated",
      "PropertyNameFromDomainObject": "IsCoordinated",
      "UiLabel": "Coordinated",
      "TypeId": "Swift.Domain.Customer.Product.Attributes.ProductPackageDetailAttribute, Swift.Domain, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"
    },
    {
      "ProductPackageDetailValues": 0,
      "PropertyNameInPropertiesCollection": "LOA/CFA",
      "PropertyNameFromDomainObject": "LoaCfa",
      "UiLabel": "LOA/CFA",
      "TypeId": "Swift.Domain.Customer.Product.Attributes.ProductPackageDetailAttribute, Swift.Domain, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"
    },
    {
      "ProductPackageDetailValues": 0,
      "PropertyNameInPropertiesCollection": "Hot Cut / Replacement",
      "PropertyNameFromDomainObject": "HasHotCutAttribute",
      "UiLabel": "Hot Cut / Replacement",
      "TypeId": "Swift.Domain.Customer.Product.Attributes.ProductPackageDetailAttribute, Swift.Domain, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"
    },
    {
      "ProductPackageDetailValues": 0,
      "PropertyNameInPropertiesCollection": "Overlapping Service?",
      "PropertyNameFromDomainObject": "HasOverlappingService",
      "UiLabel": null,
      "TypeId": "Swift.Domain.Customer.Product.Attributes.ProductPackageDetailAttribute, Swift.Domain, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"
    },
    {
      "ProductPackageDetailValues": 0,
      "PropertyNameInPropertiesCollection": "Is There Live Traffic?",
      "PropertyNameFromDomainObject": "IsThereLiveTraffic",
      "UiLabel": "Is There Live Traffic?",
      "TypeId": "Swift.Domain.Customer.Product.Attributes.ProductPackageDetailAttribute, Swift.Domain, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"
    }
  ],
  "ProductServiceAddressRels": [
    {
      "ProductPackageId": 464259129,
      "TransactionId": 556181595,
      "RelationshipName": "Address1",
      "ServiceAddressId": 66228112,
      "Action": 2,
      "ServiceAddress": {
        "ServiceAddressId": 66228112,
        "CustomerId": 966529,
        "OnNetOffNetType": "On Net",
        "EndUserClli": "LAB4COZWS02",
        "RateCenterName": "DENVER",
        "Building": null,
        "BuildingClli": "LAB4COZW",
        "BuildingType": null,
        "BuildingValue": null,
        "Floor": "5",
        "OtherUnitType": "",
        "OtherUnitValue": "",
        "Community": "DENVER",
        "Lata": "656",
        "MarketName": "DENVER",
        "Served": "Unknown",
        "WireCenter": "DNVRCONO",
        "VCoordinate": "0",
        "HCoordinate": "0",
        "PcatMarketId": "1057",
        "NpaNxx": "303 405",
        "Npa": "303",
        "Nxx": "405",
        "Longitude": -105.016779,
        "LocNum": null,
        "Latitude": 39.793103,
        "InventorySystems": null,
        "SiteBuildingExtension": "ME4",
        "BuildingExtension": "0",
        "IsOutOfMarket": false,
        "IsOffNet": false,
        "InServiceArea": "Yes",
        "ShouldTransferContacts": false,
        "EntityCode": "S02",
        "SiteStatus": "Active",
        "GlmLocationUrl": "http://glmenv1/GLMSWeb/Location/Details/SL0008693604",
        "GlmMasterLocationUrl": "http://glmenv1/GLMSWeb/Location/Details/PL0060047362",
        "Room": "WLAB",
        "Region": "NA",
        "BuildingUsage": "End User,NA Planning Metro Edge",
        "AccessCapability": [
          {
            "BandwidthTypeId": "ETHER_100MBPS",
            "BandwidthTypeName": "Ethernet 100 Mbps",
            "MasterSiteId": "PL0060047362",
            "SiteCapabilityTypeId": "ETHER",
            "SiteCapabilityTypeName": "Ethernet"
          },
          {
            "BandwidthTypeId": "ETHER_100MBPS",
            "BandwidthTypeName": "Ethernet 100 Mbps",
            "MasterSiteId": "PL0060047362",
            "SiteCapabilityTypeId": "ETHER",
            "SiteCapabilityTypeName": "Ethernet"
          },
          {
            "BandwidthTypeId": "ETHER_1GBPS",
            "BandwidthTypeName": "Ethernet 1 Gbps",
            "MasterSiteId": "PL0060047362",
            "SiteCapabilityTypeId": "ETHER",
            "SiteCapabilityTypeName": "Ethernet"
          },
          {
            "BandwidthTypeId": "ETHER_1GBPS",
            "BandwidthTypeName": "Ethernet 1 Gbps",
            "MasterSiteId": "PL0060047362",
            "SiteCapabilityTypeId": "ETHER",
            "SiteCapabilityTypeName": "Ethernet"
          },
          {
            "BandwidthTypeId": "ETHER_10GBPS",
            "BandwidthTypeName": "Ethernet 10 Gbps",
            "MasterSiteId": "PL0060047362",
            "SiteCapabilityTypeId": "ETHER",
            "SiteCapabilityTypeName": "Ethernet"
          },
          {
            "BandwidthTypeId": "ETHER_10GBPS",
            "BandwidthTypeName": "Ethernet 10 Gbps",
            "MasterSiteId": "PL0060047362",
            "SiteCapabilityTypeId": "ETHER",
            "SiteCapabilityTypeName": "Ethernet"
          }
        ],
        "BuildingProgram": null,
        "RequestedIdRedirected": false,
        "RedirectedToId": null,
        "IsDisabled": false,
        "AccessCapabilityEthernet": [
          "Ethernet 100 Mbps",
          "Ethernet 1 Gbps",
          "Ethernet 10 Gbps"
        ],
        "AccessCapabilityWave": [],
        "AccessCapabilityEPLEoS": [],
        "AccessCapabilityTDM": [],
        "GlmLocationId": "SL0008693604",
        "GlmMasterLocationId": "PL0060047362",
        "StreetAddress": null,
        "StreetNumberPrefix": null,
        "StreetNumber": "5325",
        "StreetFractional": null,
        "DirPrefix": null,
        "StreetName": "ZUNI",
        "Thoroughfare": "ST",
        "DirSuffix": null,
        "Suite": "",
        "City": "DENVER",
        "County": "ADAMS",
        "AddressLine1": null,
        "GeoPoliticalInfo": "DENVER COLORADO 80221 1499 UNITED STATES",
        "StateProvinceCode": "CO",
        "PostalZipCode": "80221",
        "CountryCode": "USA",
        "DisplayAddress": "5325 ZUNI ST DENVER COLORADO 80221 1499 UNITED STATES, Floor 5 Room WLAB",
        "FullStreet": "5325 ZUNI ST",
        "CityStateZip": "DENVER COLORADO 80221 1499 UNITED STATES"
      },
      "InstallIntervalId": null,
      "IntervalDate": null,
      "DisplayInstallInterval": null,
      "Status": null,
      "IsServiceAddressUpdated": false,
      "RelationKey": "464259129Address1"
    }
  ],
  "Customer": null,
  "ProductKeys": [
    {
      "ProductInstanceId": 352951848,
      "ProductPackageId": 464259129,
      "TransactionId": 556181595,
      "ProductId": 160,
      "IsParentProduct": true,
      "Action": "Add",
      "RequestedDueDate": null,
      "RequestedDueDateTimeZone": null,
      "PriceInfoId": 0,
      "MarketId": 1057,
      "PcatVersion": "23-Mar-26",
      "GroupingType": null,
      "EffectiveBillDate": "1/1/0001 12:00:00 AM",
      "ProductName": "Fabric Port",
      "AccountNumber": 304254,
      "KenanBAN": "5-SCDKVVQ3",
      "InvoiceDisplayBAN": "304254",
      "LexmBAN": null,
      "PromotionCode": "NONE",
      "IsExistingProduct": "No",
      "ProductCategory": null,
      "BanSelect": false,
      "ProductAttributes": [
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "CPT",
          "AttributeDisplayValue": "CSP3",
          "AttributeValue": "CSP3",
          "PcatDefinition": {
            "Name": "CPT",
            "Label": "Pricing Tier",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "CSP3",
                "Value": "CSP3",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Flex",
          "AttributeDisplayValue": "CSP",
          "AttributeValue": "CSP",
          "PcatDefinition": {
            "Name": null,
            "Label": null,
            "Type": "List",
            "Optional": null,
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 0,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": null,
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "CSP",
                "Value": "CSP",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": null,
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Network Status",
          "AttributeDisplayValue": "On Net",
          "AttributeValue": "On Net",
          "PcatDefinition": {
            "Name": "Network Status",
            "Label": "Network Status",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "On Net",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "Off Net",
                "Value": "Off Net",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "<default> On Net",
                "Value": "On Net",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Port Bandwidth",
          "AttributeDisplayValue": "1 Gbps",
          "AttributeValue": "1000 Mbps",
          "PcatDefinition": {
            "Name": "Port Bandwidth",
            "Label": "Port Bandwidth",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "1 Gbps",
                "Value": "1000 Mbps",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "10 Gbps",
                "Value": "10000 Mbps",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "High Bandwidth",
          "AttributeDisplayValue": "No",
          "AttributeValue": "No",
          "PcatDefinition": {
            "Name": "High Bandwidth",
            "Label": "Full Port Speed",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "No",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> No",
                "Value": "No",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Bandwidth",
          "AttributeDisplayValue": "Not Applicable for On Net Locations",
          "AttributeValue": "Not Applicable for On Net Locations",
          "PcatDefinition": {
            "Name": "Bandwidth",
            "Label": "Bandwidth",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "Not Applicable for On Net Locations",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> Not Applicable for On Net Locations",
                "Value": "Not Applicable for On Net Locations",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Intent",
          "AttributeDisplayValue": "NaaS",
          "AttributeValue": "NaaS",
          "PcatDefinition": {
            "Name": "Intent",
            "Label": "Intent",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "NaaS",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "Ethernet",
                "Value": "Ethernet",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "<default> NaaS (IoD or EoD)",
                "Value": "NaaS",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "UNI Type",
          "AttributeDisplayValue": "Multiplexed",
          "AttributeValue": "Multiplexed",
          "PcatDefinition": {
            "Name": "UNI Type",
            "Label": "UNI Type",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "Multiplexed",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> Multiplexed",
                "Value": "Multiplexed",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "3rd Party Cross Connect",
          "AttributeDisplayValue": "No",
          "AttributeValue": "No",
          "PcatDefinition": {
            "Name": "3rd Party Cross Connect",
            "Label": "3rd Party Cross Connect",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "No",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> No",
                "Value": "No",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "Yes",
                "Value": "Yes",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Cloud Provider",
          "AttributeDisplayValue": "N/A",
          "AttributeValue": "N/A",
          "PcatDefinition": {
            "Name": "Cloud Provider",
            "Label": "Cloud Provider",
            "Type": "List",
            "Optional": "None",
            "DefaultValue": "N/A",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> N/A",
                "Value": "N/A",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Inside Wiring",
          "AttributeDisplayValue": "Standard Delivery - To the MPoE (Customer Provided)",
          "AttributeValue": "Standard Delivery - To the MPoE (Customer Provided)",
          "PcatDefinition": {
            "Name": "Inside Wiring",
            "Label": "Building Extension",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "Extended Delivery - To the Customer Suite (Lumen Provided)",
                "Value": "Extended Delivery - To the Customer Suite (Level 3 Provided)",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "Standard Delivery - To the MPoE (Customer Provided)",
                "Value": "Standard Delivery - To the MPoE (Customer Provided)",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "IP Pop",
          "AttributeDisplayValue": "DENVER",
          "AttributeValue": "DENVER",
          "PcatDefinition": {
            "Name": "IP Pop",
            "Label": "IP Pop",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "DENVER",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "ALBANY",
                "Value": "ALBANY",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ALBUQUERQUE",
                "Value": "ALBUQUERQUE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ASHBURN",
                "Value": "ASHBURN",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ATLANTA",
                "Value": "ATLANTA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "AUSTIN",
                "Value": "AUSTIN",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BAKERSFIELD",
                "Value": "BAKERSFIELD",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BALTIMORE",
                "Value": "BALTIMORE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BATON ROUGE",
                "Value": "BATON ROUGE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BILLINGS",
                "Value": "BILLINGS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BINGHAMTON",
                "Value": "BINGHAMTON",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BIRMINGHAM",
                "Value": "BIRMINGHAM",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BOISE 2",
                "Value": "BOISE 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BOSTON 2",
                "Value": "BOSTON 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BROOKFIELD",
                "Value": "BROOKFIELD",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BURLINGTON",
                "Value": "BURLINGTON",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "CHARLOTTE",
                "Value": "CHARLOTTE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "CHARLOTTESVILLE",
                "Value": "CHARLOTTESVILLE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "CHICAGO",
                "Value": "CHICAGO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "CINCINNATI",
                "Value": "CINCINNATI",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "CLEVELAND",
                "Value": "CLEVELAND",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "COLORADO SPRINGS",
                "Value": "COLORADO SPRINGS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "COLUMBIA",
                "Value": "COLUMBIA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "COLUMBUS",
                "Value": "COLUMBUS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "COLUMBUS 2",
                "Value": "COLUMBUS 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "COLUMBUS GA",
                "Value": "COLUMBUS GA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "DALLAS",
                "Value": "DALLAS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "DAYTON",
                "Value": "DAYTON",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "<default> DENVER",
                "Value": "DENVER",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "DES MOINES",
                "Value": "DES MOINES",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "DETROIT",
                "Value": "DETROIT",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "EL PASO",
                "Value": "EL PASO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "FAYETTEVILLE",
                "Value": "FAYETTEVILLE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "FORT MYERS",
                "Value": "FORT MYERS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "FORT WORTH",
                "Value": "FORT WORTH",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "FRESNO",
                "Value": "FRESNO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "FT. LAUDERDALE",
                "Value": "FT. LAUDERDALE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "FT. WORTH",
                "Value": "FT. WORTH",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "GREENSBORO",
                "Value": "GREENSBORO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "GREENVILLE",
                "Value": "GREENVILLE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "HARRISBURG",
                "Value": "HARRISBURG",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "HONOLULU 2",
                "Value": "HONOLULU 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "HOUSTON",
                "Value": "HOUSTON",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "HUNTSVILLE",
                "Value": "HUNTSVILLE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "INDIANAPOLIS",
                "Value": "INDIANAPOLIS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "INLAND EMPIRE",
                "Value": "INLAND EMPIRE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "JACKSONVILLE",
                "Value": "JACKSONVILLE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "JERSEY CITY",
                "Value": "JERSEY CITY",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "KANSAS CITY",
                "Value": "KANSAS CITY",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "LAKE CHARLES",
                "Value": "LAKE CHARLES",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "LAS VEGAS",
                "Value": "LAS VEGAS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "LEXINGTON",
                "Value": "LEXINGTON",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "LITTLE ROCK",
                "Value": "LITTLE ROCK",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "LOS ANGELES",
                "Value": "LOS ANGELES",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "LOUISVILLE2",
                "Value": "LOUISVILLE2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "MANHATTAN",
                "Value": "MANHATTAN",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "MEMPHIS",
                "Value": "MEMPHIS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "MILWAUKEE",
                "Value": "MILWAUKEE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "MINNEAPOLIS 2",
                "Value": "MINNEAPOLIS 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "MOBILE",
                "Value": "MOBILE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "MONTGOMERY",
                "Value": "MONTGOMERY",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "MONTREAL",
                "Value": "MONTREAL",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "NASHVILLE 2",
                "Value": "NASHVILLE 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "NEW ORLEANS",
                "Value": "NEW ORLEANS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "NEWARK",
                "Value": "NEWARK",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "OAKLAND",
                "Value": "OAKLAND",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "OMAHA",
                "Value": "OMAHA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ONTARIO",
                "Value": "ONTARIO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ORANGE COUNTY",
                "Value": "ORANGE COUNTY",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ORLANDO",
                "Value": "ORLANDO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "PHILADELPHIA",
                "Value": "PHILADELPHIA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "PHOENIX",
                "Value": "PHOENIX",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "PITTSBURGH",
                "Value": "PITTSBURGH",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "PORTLAND",
                "Value": "PORTLAND",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "RALEIGH",
                "Value": "RALEIGH",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "RICHMOND",
                "Value": "RICHMOND",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "RICHMOND 2",
                "Value": "RICHMOND 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ROCHESTER2",
                "Value": "ROCHESTER2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SACREMENTO",
                "Value": "SACREMENTO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SALT LAKE CITY",
                "Value": "SALT LAKE CITY",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SAN ANTONIO",
                "Value": "SAN ANTONIO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SAN DIEGO",
                "Value": "SAN DIEGO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SAN FRANCISCO",
                "Value": "SAN FRANCISCO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SAN LUIS OBISPO",
                "Value": "SAN LUIS OBISPO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SANTA BARBARA",
                "Value": "SANTA BARBARA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SEATTLE",
                "Value": "SEATTLE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SHREVEPORT",
                "Value": "SHREVEPORT",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SPOKANE",
                "Value": "SPOKANE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ST. LOUIS",
                "Value": "ST. LOUIS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SUNNYVALE",
                "Value": "SUNNYVALE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "TAMPA",
                "Value": "TAMPA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "TORONTO",
                "Value": "TORONTO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "TUCSON",
                "Value": "TUCSON",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "TULSA",
                "Value": "TULSA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "WASHINGTON DC",
                "Value": "WASHINGTON DC",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "WASHINGTON DC 2",
                "Value": "WASHINGTON DC 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "WICHITA",
                "Value": "WICHITA",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "In Service Area",
          "AttributeDisplayValue": "Yes",
          "AttributeValue": "Yes",
          "PcatDefinition": {
            "Name": "In Service Area",
            "Label": "In Service Area",
            "Type": "Text",
            "Optional": "PreActivation",
            "DefaultValue": "Yes",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> Yes",
                "Value": "Yes",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Intrastate Certification",
          "AttributeDisplayValue": "No",
          "AttributeValue": "No",
          "PcatDefinition": {
            "Name": "Intrastate Certification",
            "Label": "Intrastate Certification",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "No",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> No",
                "Value": "No",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "Yes",
                "Value": "Yes",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Secure Company",
          "AttributeDisplayValue": null,
          "AttributeValue": null,
          "PcatDefinition": {
            "Name": "Secure Company",
            "Label": "Secure Company",
            "Type": "Text",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Customer Number",
          "AttributeDisplayValue": null,
          "AttributeValue": null,
          "PcatDefinition": {
            "Name": "Customer Number",
            "Label": "Customer Number",
            "Type": "Text",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Account Number",
          "AttributeDisplayValue": "2-L3CJPK",
          "AttributeValue": "2-L3CJPK",
          "PcatDefinition": {
            "Name": "Account Number",
            "Label": "Account Number",
            "Type": "Text",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "2-L3CJPK",
                "Value": "2-L3CJPK",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Network Architecture",
          "AttributeDisplayValue": "Metro3",
          "AttributeValue": "Metro3",
          "PcatDefinition": {
            "Name": "Network Architecture",
            "Label": "Network Architecture",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "Metro3",
                "Value": "Metro3",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "ECN Enabled",
          "AttributeDisplayValue": "false",
          "AttributeValue": "false",
          "PcatDefinition": {
            "Name": "ECN Enabled",
            "Label": "ECN Enabled",
            "Type": "List",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "false",
                "Value": "false",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Network Color",
          "AttributeDisplayValue": "Not Green",
          "AttributeValue": "Not Green",
          "PcatDefinition": {
            "Name": "Network Color",
            "Label": "Network Color",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "Not Green",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "Green",
                "Value": "Green",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "<default> Not Green",
                "Value": "Not Green",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "VPOP",
          "AttributeDisplayValue": "false",
          "AttributeValue": "false",
          "PcatDefinition": {
            "Name": "VPOP",
            "Label": "VPOP",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "false",
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> false",
                "Value": "false",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Term",
          "AttributeDisplayValue": "36",
          "AttributeValue": "36",
          "PcatDefinition": {
            "Name": "Term",
            "Label": "Term",
            "Type": "Integer",
            "Optional": "PreActivation",
            "DefaultValue": "36",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": "{RANGE:1.0:120.0}",
            "DataConstraintValues": {
              "Minimum": 1.0,
              "Maximum": 120.0,
              "DataConstraintType": 1
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "EVC Type",
          "AttributeDisplayValue": null,
          "AttributeValue": null,
          "PcatDefinition": {
            "Name": "EVC Type",
            "Label": "EVC Type",
            "Type": "Relation",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": "Connections.EVC Type",
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "User",
          "AttributeDisplayValue": null,
          "AttributeValue": null,
          "PcatDefinition": {
            "Name": "User",
            "Label": "User",
            "Type": "Text",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": null,
                "Value": null,
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "SourceSystemID",
          "AttributeDisplayValue": null,
          "AttributeValue": null,
          "PcatDefinition": {
            "Name": "SourceSystemID",
            "Label": "SourceSystemID",
            "Type": "Text",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": null,
                "Value": null,
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Petra Pricing",
          "AttributeDisplayValue": "No",
          "AttributeValue": "No",
          "PcatDefinition": {
            "Name": "Petra Pricing",
            "Label": "Petra Pricing",
            "Type": "List",
            "Optional": "None",
            "DefaultValue": "No",
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> No",
                "Value": "No",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Auto Estimate",
          "AttributeDisplayValue": "No",
          "AttributeValue": "No",
          "PcatDefinition": {
            "Name": "Auto Estimate",
            "Label": "Auto Estimate",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "No",
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> No",
                "Value": "No",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Zone Based Pricing",
          "AttributeDisplayValue": "false",
          "AttributeValue": "false",
          "PcatDefinition": {
            "Name": "Zone Based Pricing",
            "Label": "Zone Based Pricing",
            "Type": "Text",
            "Optional": "None",
            "DefaultValue": "false",
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> false",
                "Value": "false",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Lumen Network",
          "AttributeDisplayValue": "Metro 3 Colorless Multitenant NID",
          "AttributeValue": "Metro 3 Colorless Multitenant NID",
          "PcatDefinition": {
            "Name": "Lumen Network",
            "Label": "Lumen Network",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "Metro 3 Colorless Multitenant NID",
                "Value": "Metro 3 Colorless Multitenant NID",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Legacy UNI",
          "AttributeDisplayValue": "No",
          "AttributeValue": "No",
          "PcatDefinition": {
            "Name": "Legacy UNI",
            "Label": "Legacy UNI",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "No",
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> No",
                "Value": "No",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Set Solution ID",
          "AttributeDisplayValue": null,
          "AttributeValue": null,
          "PcatDefinition": {
            "Name": "Set Solution ID",
            "Label": "Set Solution ID",
            "Type": "Text",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        }
      ],
      "ProductInfoAttributes": [
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Promotion",
          "AttributeDisplayValue": "Standard Price",
          "AttributeValue": "NONE",
          "PcatDefinition": {
            "Name": null,
            "Label": null,
            "Type": "List",
            "Optional": null,
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": true,
            "MaxRepeats": 0,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": null,
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "Standard Price",
                "Value": "NONE",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": null,
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Market",
          "AttributeDisplayValue": "DENVER",
          "AttributeValue": "1057",
          "PcatDefinition": {
            "Name": null,
            "Label": null,
            "Type": "List",
            "Optional": null,
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": true,
            "MaxRepeats": 0,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": null,
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "DENVER",
                "Value": "1057",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": null,
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        }
      ],
      "PriceInfo": {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "Quantity": 1,
        "MrcStandard": 642.2,
        "NrcStandard": 500.0,
        "MrcAdjusted": 642.2,
        "NrcAdjusted": 500.0,
        "MrcDiscount": "0.00",
        "NrcDiscount": "0.00",
        "MrcDiscountType": null,
        "NrcDiscountType": null,
        "RequiresIcb": true,
        "PrepaidMinutes": 0,
        "PriceDetails": [
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Requires ICB because discount is greater than flex policy allows.",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Delivery to the MPoE - Building Extension to customer suite NOT included",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Service Level = 24x7x4",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "No Capital Approval Request needed for this product configuration.",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Port Bandwidth = 1 Gbps",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "This order may require a longer interval of 60 - 90 days.",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Metro Mrc = $388.00, USD",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Metro Nrc = $0.00, USD",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Budgetary Pricing = No",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "[MultiTerm12Used][MultiTerm12Month]",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "[MultiTerm24Used][MultiTerm24Month]",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "[MultiTerm36Used][MultiTerm36Month]",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "[MultiTerm60Used][MultiTerm60Month]",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Original Mrc=$642.2 , USD; Original Nrc=$500 , USD",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "*****  ITEMS BELOW ARE FOR TESTING PURPOSES ONLY  *****",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "MetronEligible=1, GatedQuoteOrder=0",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "DiscountedMrc = 642.2,  StandardMrc = 676",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "TableMrc = 485,  OnNetMrc = 388",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Bandwidth = Not Applicable for On Net Locations,  Port Bandwidth = 1 Gbps",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "AddRedOrOrange=1, AddGreenL=0, AddGreenN=0",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "CTLWireCenter=true, AddNoColorWireCenter=0",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Network Color=Not Green, NetworkColorGreen=0",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "NetStatusChangedToOnNet = 0,Network Status = On Net",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "OnNet=1, AddGreenOnly=0",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "NewInvbdEthernet = 0",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "BuildingCategory = 5",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "BuildingClli = LAB4COZW",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "CARDisplay = 1,  CARRequired = 0",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "RegenSite = false,  AutoAugEth = true",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "ABWCapable = true,  AEthBWCapable = [AEthBWCapable]",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "CatApproval= false,  CARBuilding= 0",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "InvestmentBuilding= false,CATApprovalSimplyOnNet=[CATApprovalSimplyOnNet]",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "CalcBandwidth=1000 Mbps",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Port Bandwidth=1 Gbps",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Audience = Order",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "ServesMultCust= Y,  AddressRegion=NA",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "AddBuildingExtension = ME4",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Inside Wiring = Standard Delivery - To the MPoE (Customer Provided), InsideWiringNA = [InsideWiringNA]",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "AddressRegion=NA,  AddressState=CO",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "PricingIcb=true,WireCenter=[WireCenter]",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "EVC Type=[EVC Type],DefaultSolutionID=[DefaultSolutionID]",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Network Architecture=Metro3",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "FlexPercent=0.5",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "Solution ID=[Solution ID],Set Solution ID = [Set Solution ID]",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          },
          {
            "ProductInstanceId": 352951848,
            "TransactionId": 556181595,
            "ItemNumber": 0,
            "Description": "ContractedRateMrc=-1,ContractedRateNrc=-1",
            "Quantity": null,
            "UnitMrc": null,
            "UnitNrc": null
          }
        ],
        "UsageDetails": [],
        "CurrencyCode": "USD",
        "MrcApplicable": true,
        "NrcApplicable": true,
        "MrcIsPercentDiscountType": false,
        "NrcIsPercentDiscountType": false,
        "MrcIsAmountDiscountType": true,
        "NrcIsAmountDiscountType": true,
        "MrcDiscountAmount": 0.0,
        "MrcDiscountPercent": 0.0,
        "NrcDiscountAmount": 0.0,
        "NrcDiscountPercent": 0.0
      },
      "Charges": [],
      "ProductKeyAttributes": [
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Product",
          "AttributeDisplayValue": "Fabric Port",
          "AttributeValue": "160",
          "PcatDefinition": {
            "Name": null,
            "Label": null,
            "Type": "Text",
            "Optional": null,
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 0,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": null,
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": null,
            "RequiredElements": null,
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "OverrideMrc",
          "AttributeDisplayValue": "-1",
          "AttributeValue": "-1",
          "PcatDefinition": {
            "Name": "OverrideMrc",
            "Label": "OverrideMrc",
            "Type": "Override",
            "Optional": "None",
            "DefaultValue": "-1",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "OverrideNrc",
          "AttributeDisplayValue": "-1",
          "AttributeValue": "-1",
          "PcatDefinition": {
            "Name": "OverrideNrc",
            "Label": "OverrideNrc",
            "Type": "Override",
            "Optional": "None",
            "DefaultValue": "-1",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Address1",
          "AttributeDisplayValue": null,
          "AttributeValue": "SL0008693604",
          "PcatDefinition": {
            "Name": "Address1",
            "Label": "Address1",
            "Type": "Address",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [],
            "RequiredElements": [
              "EthernetCompEnv"
            ],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Opportunity Type",
          "AttributeDisplayValue": "New",
          "AttributeValue": "New",
          "PcatDefinition": {
            "Name": "Opportunity Type",
            "Label": "Opportunity Type",
            "Type": "List",
            "Optional": "None",
            "DefaultValue": "New",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> New",
                "Value": "New",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "CPT",
          "AttributeDisplayValue": "CSP3",
          "AttributeValue": "CSP3",
          "PcatDefinition": {
            "Name": "CPT",
            "Label": "Pricing Tier",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "CSP3",
                "Value": "CSP3",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Flex",
          "AttributeDisplayValue": "CSP",
          "AttributeValue": "CSP",
          "PcatDefinition": {
            "Name": null,
            "Label": null,
            "Type": "List",
            "Optional": null,
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 0,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": null,
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "CSP",
                "Value": "CSP",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": null,
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Network Status",
          "AttributeDisplayValue": "On Net",
          "AttributeValue": "On Net",
          "PcatDefinition": {
            "Name": "Network Status",
            "Label": "Network Status",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "On Net",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "Off Net",
                "Value": "Off Net",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "<default> On Net",
                "Value": "On Net",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Port Bandwidth",
          "AttributeDisplayValue": "1 Gbps",
          "AttributeValue": "1000 Mbps",
          "PcatDefinition": {
            "Name": "Port Bandwidth",
            "Label": "Port Bandwidth",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "1 Gbps",
                "Value": "1000 Mbps",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "10 Gbps",
                "Value": "10000 Mbps",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "High Bandwidth",
          "AttributeDisplayValue": "No",
          "AttributeValue": "No",
          "PcatDefinition": {
            "Name": "High Bandwidth",
            "Label": "Full Port Speed",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "No",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> No",
                "Value": "No",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Bandwidth",
          "AttributeDisplayValue": "Not Applicable for On Net Locations",
          "AttributeValue": "Not Applicable for On Net Locations",
          "PcatDefinition": {
            "Name": "Bandwidth",
            "Label": "Bandwidth",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "Not Applicable for On Net Locations",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> Not Applicable for On Net Locations",
                "Value": "Not Applicable for On Net Locations",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Intent",
          "AttributeDisplayValue": "NaaS",
          "AttributeValue": "NaaS",
          "PcatDefinition": {
            "Name": "Intent",
            "Label": "Intent",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "NaaS",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "Ethernet",
                "Value": "Ethernet",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "<default> NaaS (IoD or EoD)",
                "Value": "NaaS",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "UNI Type",
          "AttributeDisplayValue": "Multiplexed",
          "AttributeValue": "Multiplexed",
          "PcatDefinition": {
            "Name": "UNI Type",
            "Label": "UNI Type",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "Multiplexed",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> Multiplexed",
                "Value": "Multiplexed",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "3rd Party Cross Connect",
          "AttributeDisplayValue": "No",
          "AttributeValue": "No",
          "PcatDefinition": {
            "Name": "3rd Party Cross Connect",
            "Label": "3rd Party Cross Connect",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "No",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> No",
                "Value": "No",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "Yes",
                "Value": "Yes",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Cloud Provider",
          "AttributeDisplayValue": "N/A",
          "AttributeValue": "N/A",
          "PcatDefinition": {
            "Name": "Cloud Provider",
            "Label": "Cloud Provider",
            "Type": "List",
            "Optional": "None",
            "DefaultValue": "N/A",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> N/A",
                "Value": "N/A",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Inside Wiring",
          "AttributeDisplayValue": "Standard Delivery - To the MPoE (Customer Provided)",
          "AttributeValue": "Standard Delivery - To the MPoE (Customer Provided)",
          "PcatDefinition": {
            "Name": "Inside Wiring",
            "Label": "Building Extension",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "Extended Delivery - To the Customer Suite (Lumen Provided)",
                "Value": "Extended Delivery - To the Customer Suite (Level 3 Provided)",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "Standard Delivery - To the MPoE (Customer Provided)",
                "Value": "Standard Delivery - To the MPoE (Customer Provided)",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "IP Pop",
          "AttributeDisplayValue": "DENVER",
          "AttributeValue": "DENVER",
          "PcatDefinition": {
            "Name": "IP Pop",
            "Label": "IP Pop",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "DENVER",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "ALBANY",
                "Value": "ALBANY",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ALBUQUERQUE",
                "Value": "ALBUQUERQUE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ASHBURN",
                "Value": "ASHBURN",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ATLANTA",
                "Value": "ATLANTA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "AUSTIN",
                "Value": "AUSTIN",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BAKERSFIELD",
                "Value": "BAKERSFIELD",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BALTIMORE",
                "Value": "BALTIMORE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BATON ROUGE",
                "Value": "BATON ROUGE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BILLINGS",
                "Value": "BILLINGS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BINGHAMTON",
                "Value": "BINGHAMTON",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BIRMINGHAM",
                "Value": "BIRMINGHAM",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BOISE 2",
                "Value": "BOISE 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BOSTON 2",
                "Value": "BOSTON 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BROOKFIELD",
                "Value": "BROOKFIELD",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "BURLINGTON",
                "Value": "BURLINGTON",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "CHARLOTTE",
                "Value": "CHARLOTTE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "CHARLOTTESVILLE",
                "Value": "CHARLOTTESVILLE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "CHICAGO",
                "Value": "CHICAGO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "CINCINNATI",
                "Value": "CINCINNATI",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "CLEVELAND",
                "Value": "CLEVELAND",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "COLORADO SPRINGS",
                "Value": "COLORADO SPRINGS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "COLUMBIA",
                "Value": "COLUMBIA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "COLUMBUS",
                "Value": "COLUMBUS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "COLUMBUS 2",
                "Value": "COLUMBUS 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "COLUMBUS GA",
                "Value": "COLUMBUS GA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "DALLAS",
                "Value": "DALLAS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "DAYTON",
                "Value": "DAYTON",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "<default> DENVER",
                "Value": "DENVER",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "DES MOINES",
                "Value": "DES MOINES",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "DETROIT",
                "Value": "DETROIT",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "EL PASO",
                "Value": "EL PASO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "FAYETTEVILLE",
                "Value": "FAYETTEVILLE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "FORT MYERS",
                "Value": "FORT MYERS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "FORT WORTH",
                "Value": "FORT WORTH",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "FRESNO",
                "Value": "FRESNO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "FT. LAUDERDALE",
                "Value": "FT. LAUDERDALE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "FT. WORTH",
                "Value": "FT. WORTH",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "GREENSBORO",
                "Value": "GREENSBORO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "GREENVILLE",
                "Value": "GREENVILLE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "HARRISBURG",
                "Value": "HARRISBURG",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "HONOLULU 2",
                "Value": "HONOLULU 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "HOUSTON",
                "Value": "HOUSTON",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "HUNTSVILLE",
                "Value": "HUNTSVILLE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "INDIANAPOLIS",
                "Value": "INDIANAPOLIS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "INLAND EMPIRE",
                "Value": "INLAND EMPIRE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "JACKSONVILLE",
                "Value": "JACKSONVILLE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "JERSEY CITY",
                "Value": "JERSEY CITY",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "KANSAS CITY",
                "Value": "KANSAS CITY",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "LAKE CHARLES",
                "Value": "LAKE CHARLES",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "LAS VEGAS",
                "Value": "LAS VEGAS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "LEXINGTON",
                "Value": "LEXINGTON",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "LITTLE ROCK",
                "Value": "LITTLE ROCK",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "LOS ANGELES",
                "Value": "LOS ANGELES",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "LOUISVILLE2",
                "Value": "LOUISVILLE2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "MANHATTAN",
                "Value": "MANHATTAN",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "MEMPHIS",
                "Value": "MEMPHIS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "MILWAUKEE",
                "Value": "MILWAUKEE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "MINNEAPOLIS 2",
                "Value": "MINNEAPOLIS 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "MOBILE",
                "Value": "MOBILE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "MONTGOMERY",
                "Value": "MONTGOMERY",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "MONTREAL",
                "Value": "MONTREAL",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "NASHVILLE 2",
                "Value": "NASHVILLE 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "NEW ORLEANS",
                "Value": "NEW ORLEANS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "NEWARK",
                "Value": "NEWARK",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "OAKLAND",
                "Value": "OAKLAND",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "OMAHA",
                "Value": "OMAHA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ONTARIO",
                "Value": "ONTARIO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ORANGE COUNTY",
                "Value": "ORANGE COUNTY",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ORLANDO",
                "Value": "ORLANDO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "PHILADELPHIA",
                "Value": "PHILADELPHIA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "PHOENIX",
                "Value": "PHOENIX",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "PITTSBURGH",
                "Value": "PITTSBURGH",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "PORTLAND",
                "Value": "PORTLAND",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "RALEIGH",
                "Value": "RALEIGH",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "RICHMOND",
                "Value": "RICHMOND",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "RICHMOND 2",
                "Value": "RICHMOND 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ROCHESTER2",
                "Value": "ROCHESTER2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SACREMENTO",
                "Value": "SACREMENTO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SALT LAKE CITY",
                "Value": "SALT LAKE CITY",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SAN ANTONIO",
                "Value": "SAN ANTONIO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SAN DIEGO",
                "Value": "SAN DIEGO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SAN FRANCISCO",
                "Value": "SAN FRANCISCO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SAN LUIS OBISPO",
                "Value": "SAN LUIS OBISPO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SANTA BARBARA",
                "Value": "SANTA BARBARA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SEATTLE",
                "Value": "SEATTLE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SHREVEPORT",
                "Value": "SHREVEPORT",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SPOKANE",
                "Value": "SPOKANE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "ST. LOUIS",
                "Value": "ST. LOUIS",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "SUNNYVALE",
                "Value": "SUNNYVALE",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "TAMPA",
                "Value": "TAMPA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "TORONTO",
                "Value": "TORONTO",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "TUCSON",
                "Value": "TUCSON",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "TULSA",
                "Value": "TULSA",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "WASHINGTON DC",
                "Value": "WASHINGTON DC",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "WASHINGTON DC 2",
                "Value": "WASHINGTON DC 2",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "WICHITA",
                "Value": "WICHITA",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "In Service Area",
          "AttributeDisplayValue": "Yes",
          "AttributeValue": "Yes",
          "PcatDefinition": {
            "Name": "In Service Area",
            "Label": "In Service Area",
            "Type": "Text",
            "Optional": "PreActivation",
            "DefaultValue": "Yes",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> Yes",
                "Value": "Yes",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Intrastate Certification",
          "AttributeDisplayValue": "No",
          "AttributeValue": "No",
          "PcatDefinition": {
            "Name": "Intrastate Certification",
            "Label": "Intrastate Certification",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "No",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> No",
                "Value": "No",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "Yes",
                "Value": "Yes",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Secure Company",
          "AttributeDisplayValue": null,
          "AttributeValue": null,
          "PcatDefinition": {
            "Name": "Secure Company",
            "Label": "Secure Company",
            "Type": "Text",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Customer Number",
          "AttributeDisplayValue": null,
          "AttributeValue": null,
          "PcatDefinition": {
            "Name": "Customer Number",
            "Label": "Customer Number",
            "Type": "Text",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Account Number",
          "AttributeDisplayValue": "2-L3CJPK",
          "AttributeValue": "2-L3CJPK",
          "PcatDefinition": {
            "Name": "Account Number",
            "Label": "Account Number",
            "Type": "Text",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "2-L3CJPK",
                "Value": "2-L3CJPK",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Network Architecture",
          "AttributeDisplayValue": "Metro3",
          "AttributeValue": "Metro3",
          "PcatDefinition": {
            "Name": "Network Architecture",
            "Label": "Network Architecture",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "Metro3",
                "Value": "Metro3",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "ECN Enabled",
          "AttributeDisplayValue": "false",
          "AttributeValue": "false",
          "PcatDefinition": {
            "Name": "ECN Enabled",
            "Label": "ECN Enabled",
            "Type": "List",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "false",
                "Value": "false",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Network Color",
          "AttributeDisplayValue": "Not Green",
          "AttributeValue": "Not Green",
          "PcatDefinition": {
            "Name": "Network Color",
            "Label": "Network Color",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "Not Green",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "Green",
                "Value": "Green",
                "ID": null,
                "NumericEquivelent": null
              },
              {
                "DisplayValue": "<default> Not Green",
                "Value": "Not Green",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "VPOP",
          "AttributeDisplayValue": "false",
          "AttributeValue": "false",
          "PcatDefinition": {
            "Name": "VPOP",
            "Label": "VPOP",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "false",
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> false",
                "Value": "false",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Term",
          "AttributeDisplayValue": "36",
          "AttributeValue": "36",
          "PcatDefinition": {
            "Name": "Term",
            "Label": "Term",
            "Type": "Integer",
            "Optional": "PreActivation",
            "DefaultValue": "36",
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": true,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": "{RANGE:1.0:120.0}",
            "DataConstraintValues": {
              "Minimum": 1.0,
              "Maximum": 120.0,
              "DataConstraintType": 1
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "EVC Type",
          "AttributeDisplayValue": null,
          "AttributeValue": null,
          "PcatDefinition": {
            "Name": "EVC Type",
            "Label": "EVC Type",
            "Type": "Relation",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": "Connections.EVC Type",
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "User",
          "AttributeDisplayValue": null,
          "AttributeValue": null,
          "PcatDefinition": {
            "Name": "User",
            "Label": "User",
            "Type": "Text",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": null,
                "Value": null,
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "SourceSystemID",
          "AttributeDisplayValue": null,
          "AttributeValue": null,
          "PcatDefinition": {
            "Name": "SourceSystemID",
            "Label": "SourceSystemID",
            "Type": "Text",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": null,
                "Value": null,
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Petra Pricing",
          "AttributeDisplayValue": "No",
          "AttributeValue": "No",
          "PcatDefinition": {
            "Name": "Petra Pricing",
            "Label": "Petra Pricing",
            "Type": "List",
            "Optional": "None",
            "DefaultValue": "No",
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> No",
                "Value": "No",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Auto Estimate",
          "AttributeDisplayValue": "No",
          "AttributeValue": "No",
          "PcatDefinition": {
            "Name": "Auto Estimate",
            "Label": "Auto Estimate",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "No",
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> No",
                "Value": "No",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Zone Based Pricing",
          "AttributeDisplayValue": "false",
          "AttributeValue": "false",
          "PcatDefinition": {
            "Name": "Zone Based Pricing",
            "Label": "Zone Based Pricing",
            "Type": "Text",
            "Optional": "None",
            "DefaultValue": "false",
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> false",
                "Value": "false",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Lumen Network",
          "AttributeDisplayValue": "Metro 3 Colorless Multitenant NID",
          "AttributeValue": "Metro 3 Colorless Multitenant NID",
          "PcatDefinition": {
            "Name": "Lumen Network",
            "Label": "Lumen Network",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "Metro 3 Colorless Multitenant NID",
                "Value": "Metro 3 Colorless Multitenant NID",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Legacy UNI",
          "AttributeDisplayValue": "No",
          "AttributeValue": "No",
          "PcatDefinition": {
            "Name": "Legacy UNI",
            "Label": "Legacy UNI",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": "No",
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "<default> No",
                "Value": "No",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": true
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Promotion",
          "AttributeDisplayValue": "Standard Price",
          "AttributeValue": "NONE",
          "PcatDefinition": {
            "Name": null,
            "Label": null,
            "Type": "List",
            "Optional": null,
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": true,
            "MaxRepeats": 0,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": null,
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "Standard Price",
                "Value": "NONE",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": null,
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Market",
          "AttributeDisplayValue": "DENVER",
          "AttributeValue": "1057",
          "PcatDefinition": {
            "Name": null,
            "Label": null,
            "Type": "List",
            "Optional": null,
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": true,
            "MaxRepeats": 0,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": null,
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "DENVER",
                "Value": "1057",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": null,
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951848,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Set Solution ID",
          "AttributeDisplayValue": null,
          "AttributeValue": null,
          "PcatDefinition": {
            "Name": "Set Solution ID",
            "Label": "Set Solution ID",
            "Type": "Text",
            "Optional": "None",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264300000000000000.0,
              "Maximum": 79228162514264300000000000000.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": true,
          "UserModified": false
        }
      ],
      "Properties": [
        {
          "Action": "Add",
          "TransactionId": 556181595,
          "PropertyName": "Promotion_Code",
          "PropertyValue": "NONE",
          "ProductInstanceId": 352951848,
          "IsProductPropertyUpdated": false
        },
        {
          "Action": "Add",
          "TransactionId": 556181595,
          "PropertyName": "Account_Number",
          "PropertyValue": "304254",
          "ProductInstanceId": 352951848,
          "IsProductPropertyUpdated": false
        },
        {
          "Action": "Add",
          "TransactionId": 556181595,
          "PropertyName": "Kenan_BAN",
          "PropertyValue": "5-SCDKVVQ3",
          "ProductInstanceId": 352951848,
          "IsProductPropertyUpdated": false
        },
        {
          "Action": "Add",
          "TransactionId": 556181595,
          "PropertyName": "Invoice_Display_BAN",
          "PropertyValue": "304254",
          "ProductInstanceId": 352951848,
          "IsProductPropertyUpdated": false
        }
      ],
      "RelatedNumbers": [],
      "AvailableRelationship": [
        {
          "Name": "Connections",
          "Products": [
            159,
            237,
            518
          ],
          "Mininum": 0,
          "Maximun": 500,
          "Address": "",
          "ProductAttributeFilter": {
            "CurrentProduct": null,
            "RelatedProduct": null,
            "Comparison": "|",
            "Filter1": {
              "CurrentProduct": {
                "Name": "Address1",
                "Type": "Address",
                "Element": ""
              },
              "RelatedProduct": {
                "Name": "Address1",
                "Type": "Address",
                "Element": ""
              },
              "Comparison": "=",
              "Filter1": null,
              "Filter2": null
            },
            "Filter2": {
              "CurrentProduct": {
                "Name": "Address1",
                "Type": "Address",
                "Element": ""
              },
              "RelatedProduct": {
                "Name": "Address2",
                "Type": "Address",
                "Element": ""
              },
              "Comparison": "=",
              "Filter1": null,
              "Filter2": null
            }
          },
          "AdditionalFilteringRule": "Customer Number=Customer Number",
          "UserCanAssign": false
        }
      ],
      "EditableRelationship": [],
      "MissedMandatoryRelationship": [],
      "MandatoryRelationship": [],
      "OptionalRelationship": [
        {
          "Name": "Connections",
          "Products": [
            159,
            237,
            518
          ],
          "Mininum": 0,
          "Maximun": 500,
          "Address": "",
          "ProductAttributeFilter": {
            "CurrentProduct": null,
            "RelatedProduct": null,
            "Comparison": "|",
            "Filter1": {
              "CurrentProduct": {
                "Name": "Address1",
                "Type": "Address",
                "Element": ""
              },
              "RelatedProduct": {
                "Name": "Address1",
                "Type": "Address",
                "Element": ""
              },
              "Comparison": "=",
              "Filter1": null,
              "Filter2": null
            },
            "Filter2": {
              "CurrentProduct": {
                "Name": "Address1",
                "Type": "Address",
                "Element": ""
              },
              "RelatedProduct": {
                "Name": "Address2",
                "Type": "Address",
                "Element": ""
              },
              "Comparison": "=",
              "Filter1": null,
              "Filter2": null
            }
          },
          "AdditionalFilteringRule": "Customer Number=Customer Number",
          "UserCanAssign": false
        }
      ],
      "BundlePackage": null,
      "IsProductKeyAdded": false,
      "IsProductKeyRemoved": false,
      "IsProductKeyCancelled": false,
      "IsProductKeyDisconnect": false,
      "IsProductKeyUpdated": false,
      "OriginalTransactionId": 0,
      "CurrencyCode": "USD",
      "ActionDisplayValue": null,
      "GPId": null,
      "CanAddProductKey": false,
      "UnableToAddMessage": null,
      "RootProductInstanceId": 352951848,
      "ParentProductInstanceId": 352951848,
      "IsChangeFlag": false,
      "IsFirstAppearance": false,
      "AllowOverrideMrc": false,
      "AllowOverrideNrc": false,
      "AllowOverrideYrc": false,
      "DisableProductPrices": false,
      "RoutingGroupOverride": null,
      "VendorAddressCorrelationId": null,
      "VendorAddressType": null,
      "VendorAddressStreetNumberDirectionalPrefix": null,
      "VendorAddressStreetNumberDirectionalSuffix": null,
      "VendorAddressStreetNameDirectionalPrefix": null,
      "VendorAddressStreetNameDirectionalSuffix": null,
      "VendorAddressLocationTypeOne": null,
      "VendorAddressLocationTypeTwo": null,
      "VendorAddressLocationTypeThree": null,
      "VendorAddressLocationDetailsOne": null,
      "VendorAddressLocationDetailsTwo": null,
      "VendorAddressLocationDetailsThree": null,
      "VendorAddressStreetName": null,
      "VendorAddressStreetNumber": null,
      "VendorAddressStreetType": null,
      "VendorAddressCity": null,
      "VendorAddressState": null,
      "VendorAddressZipCode": null,
      "VendorAddressBypassValidationReason": null,
      "VendorAddressBypassValidationFlag": null,
      "SpaceCode": null,
      "Mrc": 642.2,
      "Nrc": 500.0,
      "Yrc": {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Name": "Fabric Port",
        "Action": "Add",
        "AmountStandard": 0.0,
        "AmountDiscount": 0.0,
        "AmountAdjusted": 0.0,
        "AllowOveride": false,
        "OverrideAttribute": null,
        "Frequency": {
          "name": "YRC",
          "description": "Annually Recurring Charge",
          "frequencyId": 3
        },
        "SuperUserOverride": false,
        "ToolTip": null,
        "AmortizedAmount": 0.0,
        "AmortizedTerm": 0.0,
        "PercentAmortized": 0.0,
        "DiscountPercent": 0.0
      },
      "MissedMandatoryRelatedProducts": [],
      "OptionalRelatedProductBtnHolder": {
        "ProductInstanceId": 0,
        "RelationshipName": null,
        "RelatedProductInstanceId": 0,
        "RelatedGlobalProductId": null,
        "TransactionId": 0,
        "RelatedProductTransactionId": 0,
        "Action": null,
        "RelatedRelationshipName": null,
        "Status": null,
        "RelatedProductId": 0,
        "ProductPackageId": 0,
        "RelatedProductPackageId": 0,
        "RelatedGlobalPackageId": null,
        "RelatedProductName": null,
        "RelatedProductServiceAlias": null,
        "IsMandatoryRelatedProduct": false,
        "UserCanAssign": false,
        "IsNoLongerValid": false,
        "RelatedPcatProductId": 0,
        "UserCanSever": null
      },
      "PromotionAttribute": {
        "ProductInstanceId": 352951848,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Promotion",
        "AttributeDisplayValue": "Standard Price",
        "AttributeValue": "NONE",
        "PcatDefinition": {
          "Name": null,
          "Label": null,
          "Type": "List",
          "Optional": null,
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": true,
          "MaxRepeats": 0,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": null,
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": true,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": [
            {
              "DisplayValue": "Standard Price",
              "Value": "NONE",
              "ID": null,
              "NumericEquivelent": null
            }
          ],
          "RequiredElements": null,
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      "IsAsrVendorAddressVisible": false,
      "IsProductKeyRelatedNumbersModified": false,
      "IsForceModify": false,
      "OpenExistingAccountPageUrl": "http://am-test1/AMWeb/BillingAccount/Details/",
      "AmortizedTerm": 0.0,
      "AmortizedAmount": 0.0,
      "PercentAmortized": 0.0
    },
    {
      "ProductInstanceId": 352951849,
      "ProductPackageId": 464259129,
      "TransactionId": 556181595,
      "ProductId": 284,
      "IsParentProduct": false,
      "Action": "Add",
      "RequestedDueDate": null,
      "RequestedDueDateTimeZone": null,
      "PriceInfoId": 0,
      "MarketId": 1057,
      "PcatVersion": "23-Mar-26",
      "GroupingType": null,
      "EffectiveBillDate": "1/1/0001 12:00:00 AM",
      "ProductName": "Dynamic Connections",
      "AccountNumber": 304254,
      "KenanBAN": "5-SCDKVVQ3",
      "InvoiceDisplayBAN": "304254",
      "LexmBAN": null,
      "PromotionCode": "NONE",
      "IsExistingProduct": "No",
      "ProductCategory": null,
      "BanSelect": false,
      "ProductAttributes": [
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "CPT",
          "AttributeDisplayValue": "CSP3",
          "AttributeValue": "CSP3",
          "PcatDefinition": {
            "Name": "CPT",
            "Label": "Pricing Tier",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264337593543950335.0,
              "Maximum": 79228162514264337593543950335.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "CSP3",
                "Value": "CSP3",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Intent",
          "AttributeDisplayValue": "NaaS (IoD or EoD)",
          "AttributeValue": "NaaS",
          "PcatDefinition": {
            "Name": "Intent",
            "Label": "Intent",
            "Type": "Parent",
            "Optional": "PreActivation",
            "DefaultValue": "Ethernet",
            "OtherAttributeName": "",
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264337593543950335.0,
              "Maximum": 79228162514264337593543950335.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "NaaS (IoD or EoD)",
                "Value": "NaaS",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "ParentID",
          "AttributeDisplayValue": "160",
          "AttributeValue": "160",
          "PcatDefinition": {
            "Name": "ParentID",
            "Label": "ParentID",
            "Type": "Parent",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": "Product",
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264337593543950335.0,
              "Maximum": 79228162514264337593543950335.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "160",
                "Value": "160",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        }
      ],
      "ProductInfoAttributes": [
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Promotion",
          "AttributeDisplayValue": "NONE",
          "AttributeValue": "NONE",
          "PcatDefinition": {
            "Name": null,
            "Label": null,
            "Type": "Text",
            "Optional": null,
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 0,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": null,
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": false,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": null,
            "RequiredElements": null,
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        }
      ],
      "PriceInfo": {
        "ProductInstanceId": 352951849,
        "TransactionId": 556181595,
        "Action": "Add",
        "Quantity": 1,
        "MrcStandard": 0.0,
        "NrcStandard": 0.0,
        "MrcAdjusted": 0.0,
        "NrcAdjusted": 0.0,
        "MrcDiscount": "0%",
        "NrcDiscount": "0%",
        "MrcDiscountType": null,
        "NrcDiscountType": null,
        "RequiresIcb": false,
        "PrepaidMinutes": 0,
        "PriceDetails": [],
        "UsageDetails": [],
        "CurrencyCode": "USD",
        "MrcApplicable": false,
        "NrcApplicable": true,
        "MrcIsPercentDiscountType": false,
        "NrcIsPercentDiscountType": false,
        "MrcIsAmountDiscountType": true,
        "NrcIsAmountDiscountType": true,
        "MrcDiscountAmount": 0.0,
        "MrcDiscountPercent": 0.0,
        "NrcDiscountAmount": 0.0,
        "NrcDiscountPercent": 0.0
      },
      "Charges": [],
      "ProductKeyAttributes": [
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "CPT",
          "AttributeDisplayValue": "CSP3",
          "AttributeValue": "CSP3",
          "PcatDefinition": {
            "Name": "CPT",
            "Label": "Pricing Tier",
            "Type": "List",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": true,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264337593543950335.0,
              "Maximum": 79228162514264337593543950335.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "CSP3",
                "Value": "CSP3",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Intent",
          "AttributeDisplayValue": "NaaS (IoD or EoD)",
          "AttributeValue": "NaaS",
          "PcatDefinition": {
            "Name": "Intent",
            "Label": "Intent",
            "Type": "Parent",
            "Optional": "PreActivation",
            "DefaultValue": "Ethernet",
            "OtherAttributeName": "",
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264337593543950335.0,
              "Maximum": 79228162514264337593543950335.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "NaaS (IoD or EoD)",
                "Value": "NaaS",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "ParentID",
          "AttributeDisplayValue": "160",
          "AttributeValue": "160",
          "PcatDefinition": {
            "Name": "ParentID",
            "Label": "ParentID",
            "Type": "Parent",
            "Optional": "PreActivation",
            "DefaultValue": null,
            "OtherAttributeName": "Product",
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 1,
            "Mask": "",
            "DataConstraint": null,
            "DataConstraintValues": {
              "Minimum": -79228162514264337593543950335.0,
              "Maximum": 79228162514264337593543950335.0,
              "DataConstraintType": 0
            },
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": true,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": [
              {
                "DisplayValue": "160",
                "Value": "160",
                "ID": null,
                "NumericEquivelent": null
              }
            ],
            "RequiredElements": [],
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Promotion",
          "AttributeDisplayValue": "NONE",
          "AttributeValue": "NONE",
          "PcatDefinition": {
            "Name": null,
            "Label": null,
            "Type": "Text",
            "Optional": null,
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 0,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": null,
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": false,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": null,
            "RequiredElements": null,
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        },
        {
          "ProductInstanceId": 352951849,
          "TransactionId": 556181595,
          "Action": "Add",
          "AttributeName": "Product",
          "AttributeDisplayValue": "Dynamic Connections",
          "AttributeValue": "284",
          "PcatDefinition": {
            "Name": null,
            "Label": null,
            "Type": "Text",
            "Optional": null,
            "DefaultValue": null,
            "OtherAttributeName": null,
            "Enable": false,
            "Visible": false,
            "MaxRepeats": 0,
            "Mask": null,
            "DataConstraint": null,
            "DataConstraintValues": null,
            "InternalOnly": false,
            "ComplexType": 0,
            "IsValid": false,
            "RequiresRefresh": false,
            "ErrorString": null,
            "NetCrackerId": null,
            "AffectsLinkedAttributes": false,
            "LinkedAttribute": null,
            "Values": null,
            "RequiredElements": null,
            "RestartWorkflow": false
          },
          "AttributeId": null,
          "AttributeNumericEquivalent": 0.0,
          "Deleted": false,
          "IsRequired": false,
          "ApplicableForChange": false,
          "UserModified": false
        }
      ],
      "Properties": [
        {
          "Action": "Add",
          "TransactionId": 556181595,
          "PropertyName": "Promotion_Code",
          "PropertyValue": "NONE",
          "ProductInstanceId": 352951849,
          "IsProductPropertyUpdated": false
        },
        {
          "Action": "Add",
          "TransactionId": 556181595,
          "PropertyName": "Account_Number",
          "PropertyValue": "304254",
          "ProductInstanceId": 352951849,
          "IsProductPropertyUpdated": false
        },
        {
          "Action": "Add",
          "TransactionId": 556181595,
          "PropertyName": "Kenan_BAN",
          "PropertyValue": "5-SCDKVVQ3",
          "ProductInstanceId": 352951849,
          "IsProductPropertyUpdated": false
        },
        {
          "Action": "Add",
          "TransactionId": 556181595,
          "PropertyName": "Invoice_Display_BAN",
          "PropertyValue": "304254",
          "ProductInstanceId": 352951849,
          "IsProductPropertyUpdated": false
        }
      ],
      "RelatedNumbers": [],
      "AvailableRelationship": [],
      "EditableRelationship": [],
      "MissedMandatoryRelationship": [],
      "MandatoryRelationship": [],
      "OptionalRelationship": [],
      "BundlePackage": null,
      "IsProductKeyAdded": false,
      "IsProductKeyRemoved": false,
      "IsProductKeyCancelled": false,
      "IsProductKeyDisconnect": false,
      "IsProductKeyUpdated": false,
      "OriginalTransactionId": 0,
      "CurrencyCode": "USD",
      "ActionDisplayValue": null,
      "GPId": null,
      "CanAddProductKey": false,
      "UnableToAddMessage": null,
      "RootProductInstanceId": 352951848,
      "ParentProductInstanceId": 352951848,
      "IsChangeFlag": false,
      "IsFirstAppearance": false,
      "AllowOverrideMrc": false,
      "AllowOverrideNrc": false,
      "AllowOverrideYrc": false,
      "DisableProductPrices": false,
      "RoutingGroupOverride": null,
      "VendorAddressCorrelationId": null,
      "VendorAddressType": null,
      "VendorAddressStreetNumberDirectionalPrefix": null,
      "VendorAddressStreetNumberDirectionalSuffix": null,
      "VendorAddressStreetNameDirectionalPrefix": null,
      "VendorAddressStreetNameDirectionalSuffix": null,
      "VendorAddressLocationTypeOne": null,
      "VendorAddressLocationTypeTwo": null,
      "VendorAddressLocationTypeThree": null,
      "VendorAddressLocationDetailsOne": null,
      "VendorAddressLocationDetailsTwo": null,
      "VendorAddressLocationDetailsThree": null,
      "VendorAddressStreetName": null,
      "VendorAddressStreetNumber": null,
      "VendorAddressStreetType": null,
      "VendorAddressCity": null,
      "VendorAddressState": null,
      "VendorAddressZipCode": null,
      "VendorAddressBypassValidationReason": null,
      "VendorAddressBypassValidationFlag": null,
      "SpaceCode": null,
      "Mrc": 0.0,
      "Nrc": 0.0,
      "Yrc": {
        "ProductInstanceId": 352951849,
        "TransactionId": 556181595,
        "Name": "Dynamic Connections",
        "Action": "Add",
        "AmountStandard": 0.0,
        "AmountDiscount": 0.0,
        "AmountAdjusted": 0.0,
        "AllowOveride": false,
        "OverrideAttribute": null,
        "Frequency": {
          "name": "YRC",
          "description": "Annually Recurring Charge",
          "frequencyId": 3
        },
        "SuperUserOverride": false,
        "ToolTip": null,
        "AmortizedAmount": 0.0,
        "AmortizedTerm": 0.0,
        "PercentAmortized": 0.0,
        "DiscountPercent": 0.0
      },
      "MissedMandatoryRelatedProducts": [],
      "OptionalRelatedProductBtnHolder": {
        "ProductInstanceId": 0,
        "RelationshipName": null,
        "RelatedProductInstanceId": 0,
        "RelatedGlobalProductId": null,
        "TransactionId": 0,
        "RelatedProductTransactionId": 0,
        "Action": null,
        "RelatedRelationshipName": null,
        "Status": null,
        "RelatedProductId": 0,
        "ProductPackageId": 0,
        "RelatedProductPackageId": 0,
        "RelatedGlobalPackageId": null,
        "RelatedProductName": null,
        "RelatedProductServiceAlias": null,
        "IsMandatoryRelatedProduct": false,
        "UserCanAssign": false,
        "IsNoLongerValid": false,
        "RelatedPcatProductId": 0,
        "UserCanSever": null
      },
      "PromotionAttribute": {
        "ProductInstanceId": 352951849,
        "TransactionId": 556181595,
        "Action": "Add",
        "AttributeName": "Promotion",
        "AttributeDisplayValue": "NONE",
        "AttributeValue": "NONE",
        "PcatDefinition": {
          "Name": null,
          "Label": null,
          "Type": "Text",
          "Optional": null,
          "DefaultValue": null,
          "OtherAttributeName": null,
          "Enable": false,
          "Visible": false,
          "MaxRepeats": 0,
          "Mask": null,
          "DataConstraint": null,
          "DataConstraintValues": null,
          "InternalOnly": false,
          "ComplexType": 0,
          "IsValid": false,
          "RequiresRefresh": false,
          "ErrorString": null,
          "NetCrackerId": null,
          "AffectsLinkedAttributes": false,
          "LinkedAttribute": null,
          "Values": null,
          "RequiredElements": null,
          "RestartWorkflow": false
        },
        "AttributeId": null,
        "AttributeNumericEquivalent": 0.0,
        "Deleted": false,
        "IsRequired": false,
        "ApplicableForChange": false,
        "UserModified": false
      },
      "IsAsrVendorAddressVisible": false,
      "IsProductKeyRelatedNumbersModified": false,
      "IsForceModify": false,
      "OpenExistingAccountPageUrl": "http://am-test1/AMWeb/BillingAccount/Details/",
      "AmortizedTerm": 0.0,
      "AmortizedAmount": 0.0,
      "PercentAmortized": 0.0
    }
  ],
  "RelatedProducts": [],
  "RelatedNumbers": [],
  "Properties": [
    {
      "ProductPackageId": 464259129,
      "TransactionId": 556181595,
      "Action": "Add",
      "PropertyName": "Hot Cut / Replacement",
      "PropertyValue": "No",
      "IsProductPackagePropertyUpdated": false
    },
    {
      "ProductPackageId": 464259129,
      "TransactionId": 556181595,
      "Action": "Add",
      "PropertyName": "Overlapping Service?",
      "PropertyValue": "No",
      "IsProductPackagePropertyUpdated": false
    },
    {
      "ProductPackageId": 464259129,
      "TransactionId": 556181595,
      "Action": "Add",
      "PropertyName": "Delivery_Region_Code",
      "PropertyValue": "NA",
      "IsProductPackagePropertyUpdated": false
    }
  ],
  "SalesTeamMembers": null,
  "KenanBAN": "5-SCDKVVQ3",
  "AccountNumber": 304254,
  "LexmBAN": null,
  "InvoiceDisplayBAN": "304254",
  "ShippingAddress": null,
  "AccountNumberUrl": null,
  "IpPopServiceAddress": null,
  "AddNewAccountPageUrl": "http://am-test1/amweb/BillingAccount/Create/",
  "OpenExistingAccountPageUrl": "http://am-test1/AMWeb/BillingAccount/Details/",
  "IsForceModify": false,
  "ChangeInitiators": null,
  "ChangeReasons": null,
  "Markets": null,
  "EditableActions": [
    "Modify",
    "Disconnect"
  ]
}