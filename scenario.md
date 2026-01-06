
# Sanabel Communication Service – Communication Scenario (V1)

## 1️⃣ Actors / Roles

| HR Role             | Chat Role       | Permissions (V1)                                         |
| ------------------- | --------------- | -------------------------------------------------------- |
| hr.employee.manager | CHAT_ADMIN      | chat.read, chat.send, chat.delete_own, chat.manage_group |
| hr.employee         | CHAT_USER       | chat.read, chat.send                                     |
| hr.manager          | CHAT_ADMIN      | chat.read, chat.send, chat.delete_own, chat.manage_group |
| hr.deputy           | CHAT_ADMIN      | chat.read, chat.send, chat.delete_own, chat.manage_group |
| boss                | CHAT_SUPERVISOR | chat.read, chat.send, chat.delete_any, chat.manage_group |
| visitor             | CHAT_USER       | chat.read                                                |

> ملاحظات: Chat Role خاص بالسيرفس ويحدد Permissions داخليًا. Role الأصلي من HR System محفوظ في `user.role` للتوثيق.

## 2️⃣ Types of Communication

| Type                     | Description                         | Who Can Initiate                       |
| ------------------------ | ----------------------------------- | -------------------------------------- |
| Direct (1-1)             | Private message between two users   | CHAT_USER, CHAT_ADMIN, CHAT_SUPERVISOR |
| Group Chat               | Conversation between multiple users | CHAT_ADMIN, CHAT_SUPERVISOR            |
| Broadcast / Announcement | Message from Boss to all employees  | CHAT_SUPERVISOR (Boss only)            |

## 3️⃣ Business Rules

### Direct Messages

* CHAT_USER → يمكن إرسال رسالة فقط للموظفين ضمن نفس القسم / المؤسسة.
* CHAT_ADMIN → يمكن إرسال رسالة لأي موظف ضمن المؤسسة.
* CHAT_SUPERVISOR → يمكن إرسال رسالة لأي موظف.
* Visitor → لا يمكن إرسال رسالة، يمكن فقط استقبال الرسائل.

### Group Chat

* CHAT_ADMIN → يمكن إنشاء جروب داخل القسم الخاص به.
* CHAT_SUPERVISOR → يمكن إنشاء أي جروب المؤسسة بالكامل.
* CHAT_USER → لا يمكن إنشاء جروبات.

### Message Lifecycle

* Send → يجب تسجيل كل رسالة في Audit Log.
* Edit → يمكن للمرسل فقط (chat.delete_own) تعديل رسالته.
* Delete → حسب Role/Permission:

  * chat.delete_own → حذف رسائل المرسل فقط (soft delete)
  * chat.delete_any → حذف أي رسالة (Admin / Supervisor)

## 4️⃣ User Flows

### Flow 1: Send Direct Message

```
Given user is authenticated via HR System
And user has role mapped to CHAT_USER / CHAT_ADMIN / CHAT_SUPERVISOR
When user selects a recipient allowed by business rules
And sends a message
Then message is stored in MongoDB
And AuditLog entry is created
And recipient receives message via Socket.io
```

### Flow 2: Create Group

```
Given user has permission chat.manage_group
When user selects multiple recipients
And creates a group conversation
Then Conversation is created in MongoDB
And members are added
And AuditLog entry is created
```

### Flow 3: Edit Message

```
Given user has permission chat.delete_own
When user edits a message they sent
Then the message content is updated
And editedAt timestamp is set
And AuditLog entry is created
```

### Flow 4: Delete Message

```
Given user has permission chat.delete_own or chat.delete_any
When user deletes a message
Then message.deletedAt is set
And AuditLog entry is created
```

### Flow 5: Receive Messages

```
Given user is connected via Socket.io
When a message is sent to them
Then they receive message in real-time
And message is persisted
```

## 5️⃣ Permission Matrix (V1)

| Chat Role       | chat.read | chat.send | chat.delete_own | chat.delete_any | chat.manage_group | chat.create_group |
| --------------- | --------- | --------- | --------------- | --------------- | ----------------- | ----------------- |
| CHAT_USER       | ✅         | ✅         | ❌               | ❌               | ❌                 | ❌                 |
| CHAT_ADMIN      | ✅         | ✅         | ✅               | ❌               | ✅                 | ✅                 |
| CHAT_SUPERVISOR | ✅         | ✅         | ✅               | ✅               | ✅                 | ✅                 |

## 6️⃣ Audit Requirements

* All message actions (send, edit, delete) → record:

  * actorId
  * action
  * entityType (Message, Conversation, Group)
  * entityId
  * timestamp
  * metadata (optional)
* All group actions (create, rename, delete, member add/remove) → same structure.

## 7️⃣ Constraints / Validations

* Users can only message allowed recipients (same department / allowed by role).
* Visitors can only read, cannot send.
* Chat system trusts identity from HR System, no login or password handled locally.
* Soft delete implemented for all deletions.
