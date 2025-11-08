# 📥 How to Install Marathi Voice on Windows

## 🎯 **Complete Installation Guide**

Follow these steps carefully to install Marathi text-to-speech voice on Windows.

---

## 📋 **Method 1: Windows Settings (Recommended)**

### **Step-by-Step Instructions**

#### **Step 1: Open Windows Settings**

**Option A:**
- Press `Win + I` keys together

**Option B:**
- Click **Start** button
- Click **Settings** (gear icon)

---

#### **Step 2: Navigate to Language Settings**

1. In Settings window, click **Time & Language**
   - Look for clock icon
   - Usually in the left sidebar

2. Click **Language & Region** (or **Language**)
   - In Windows 11: "Language & Region"
   - In Windows 10: "Language"

---

#### **Step 3: Add Marathi Language**

1. **Find "Preferred languages" section**
   - You'll see list of installed languages
   - English (United States) is usually there

2. **Click "Add a language" button**
   - Blue button with "+" icon
   - Opens language selection window

3. **Search for Marathi**
   - Type "Marathi" in search box
   - Or type "मराठी"

4. **Select the correct option**
   - Look for: **Marathi (India)**
   - Or: **मराठी (भारत)**
   - Language code: `mr-IN`
   - Click on it to select

5. **Click "Next" button**

---

#### **Step 4: Choose Language Features**

**IMPORTANT:** This step is critical!

You'll see checkboxes for language features:

✅ **Check these:**
- ✅ **Text-to-speech** (MUST CHECK - This installs the voice!)
- ✅ **Speech recognition** (Optional, but recommended)

❌ **Optional (can uncheck to save space):**
- ❌ **Install language pack** (Not needed for voice only)
- ❌ **Set as my Windows display language** (Not needed)
- ❌ **Handwriting** (Not needed)
- ❌ **Basic typing** (Not needed)

**Click "Install" button**

---

#### **Step 5: Wait for Installation**

1. **Download Progress**
   - Shows "Installing language features..."
   - Progress bar appears
   - Takes 2-5 minutes (depends on internet speed)

2. **Don't close Settings window**
   - Let it complete
   - You can minimize and do other work

3. **Completion**
   - Shows "Language installed" or checkmark ✅
   - Marathi appears in language list

---

#### **Step 6: Verify Installation**

1. **Check Language List**
   - Marathi should now appear in "Preferred languages"
   - Shows: मराठी (भारत) or Marathi (India)

2. **Check Features**
   - Click on Marathi in the list
   - Click "Options" button
   - Should show "Text-to-speech" with checkmark ✅

---

#### **Step 7: Restart Browser**

**IMPORTANT:** Browser needs restart to detect new voice

1. **Close ALL browser windows**
   - Don't just close tab
   - Close entire browser
   - Check taskbar - no browser icon should be running

2. **Wait 5 seconds**

3. **Open browser again**

4. **Go to your app**

---

#### **Step 8: Test the Voice**

1. **Open** `test_marathi_voice.html`
2. **Click** "List All Voices" button
3. **Should now see:**
   ```
   🇮🇳 Marathi Voices (मराठी)
   ✅ Microsoft Swara - Marathi (India)
   Language: mr-IN
   ```

4. **Click** "🔊 Speak in Marathi" to test
5. **Should hear** Marathi voice speaking!

---

## 📋 **Method 2: PowerShell Command (Advanced)**

If Method 1 doesn't work, try this:

### **Step 1: Open PowerShell as Administrator**

1. **Search** "PowerShell" in Start menu
2. **Right-click** "Windows PowerShell"
3. **Select** "Run as administrator"
4. **Click** "Yes" on UAC prompt

### **Step 2: Run Installation Command**

**Copy and paste this command:**

```powershell
# Install Marathi language pack with TTS
$LanguageList = Get-WinUserLanguageList
$LanguageList.Add("mr-IN")
Set-WinUserLanguageList $LanguageList -Force

# Install speech features
Add-WindowsCapability -Online -Name "Language.TextToSpeech~~~mr-IN~0.0.1.0"
```

**Press Enter**

### **Step 3: Wait for Installation**

- Takes 2-5 minutes
- Shows progress in PowerShell
- Don't close window until complete

### **Step 4: Restart Computer**

```powershell
Restart-Computer
```

Or manually restart your computer.

---

## 📋 **Method 3: Manual Download (If Above Fail)**

### **Step 1: Download Language Pack**

**Option A: Microsoft Store**
1. Open **Microsoft Store**
2. Search "Marathi Local Experience Pack"
3. Click **Get** or **Install**
4. Wait for download and installation

**Option B: Windows Update**
1. Open **Settings** → **Windows Update**
2. Click **Check for updates**
3. Look for "Language pack - Marathi"
4. Click **Download and install**

---

## 🔍 **Troubleshooting**

### **Issue 1: Can't find "Add a language" button**

**Solution:**
```
Windows 11:
Settings → Time & Language → Language & Region → Add a language

Windows 10:
Settings → Time & Language → Language → Add a language
```

---

### **Issue 2: Marathi not in search results**

**Solution:**
1. Make sure you're connected to internet
2. Try searching "मराठी" (in Devanagari)
3. Scroll down the language list
4. Look for "Marathi (India)" or "mr-IN"

---

### **Issue 3: Installation fails or gets stuck**

**Solution:**
1. **Check internet connection**
2. **Check Windows Update is working**
   - Settings → Windows Update → Check for updates
3. **Check disk space**
   - Need at least 50-100 MB free
4. **Restart computer and try again**
5. **Try Method 2 (PowerShell)**

---

### **Issue 4: Installed but voice not showing**

**Solution:**
1. **Restart computer** (not just browser)
2. **Wait 5 minutes** after restart
3. **Open browser**
4. **Test again** with `test_marathi_voice.html`

---

### **Issue 5: "Text-to-speech" option not available**

**Solution:**
1. **Update Windows**
   - Settings → Windows Update
   - Install all updates
   - Restart computer
2. **Try again** after updates

---

### **Issue 6: Voice installed but sounds wrong**

**Solution:**
1. **Check voice name**
   - Should be "Microsoft Swara" or similar
   - Language should be "mr-IN"
2. **Test in test page first**
3. **If robotic/poor quality**: This is normal for system voices
4. **Alternative**: Use Hindi voice instead (better quality)

---

## ✅ **Verification Checklist**

After installation, verify:

### **In Windows Settings:**
- [ ] Marathi appears in language list
- [ ] Text-to-speech feature shows checkmark ✅
- [ ] No error messages

### **In Test Page:**
- [ ] Open `test_marathi_voice.html`
- [ ] Click "List All Voices"
- [ ] See "Marathi voices: 1" (or more)
- [ ] See voice name (e.g., "Microsoft Swara")
- [ ] Click "Speak in Marathi" - hear voice ✅

### **In Main App:**
- [ ] Refresh app (Ctrl + F5)
- [ ] Click 🎙️ Voice button
- [ ] See "Marathi (मराठी)" section
- [ ] See Marathi voice listed
- [ ] Select it and test

---

## 🎯 **Expected Voice Names**

After installation, you should see one of these:

### **Windows 10/11:**
- **Microsoft Swara - Marathi (India)** ✅ Most common
- **Microsoft Marathi Desktop** ✅ Alternative name
- **Swara** ✅ Short name
- Language code: `mr-IN` ✅

### **If You See:**
- ✅ Any voice with "Marathi" in name
- ✅ Any voice with language "mr-IN"
- ✅ Any voice with "Swara" in name

**These will all work!**

---

## 📊 **Installation Size**

**Disk Space Required:**
- Text-to-speech only: ~50-100 MB
- Full language pack: ~200-300 MB

**Download Time:**
- Fast internet (50+ Mbps): 1-2 minutes
- Medium internet (10-50 Mbps): 2-5 minutes
- Slow internet (<10 Mbps): 5-10 minutes

---

## 🔄 **Alternative: Use Hindi Voice**

If Marathi installation fails or voice quality is poor:

### **Why Hindi is Good Alternative:**

1. **Already installed** (no download needed)
2. **Better quality** (Microsoft Hemant is good)
3. **Similar language** (can read Marathi text)
4. **More reliable** (better support)

### **Setup:**
```
🌐 Speech Recognition: Marathi (मराठी)
🎙️ Voice Output: Microsoft Hemant (Hindi)

Result:
- Speak in Marathi ✅
- Get Marathi text ✅
- Hear Hindi voice reading it ✅
```

---

## 📱 **Mobile/Android Alternative**

If you're on Android:

### **Better Marathi Support:**
1. Android has better Marathi TTS
2. Google TTS includes Marathi
3. Works in Chrome browser
4. Better quality than Windows

### **Setup on Android:**
1. Settings → System → Languages & input
2. Text-to-speech output
3. Download Google TTS
4. Download Marathi voice data
5. Open your app in Chrome
6. Marathi voice will work!

---

## 🎉 **Success Indicators**

### **You'll know it worked when:**

1. ✅ Windows Settings shows Marathi with TTS ✅
2. ✅ Test page shows "Marathi voices: 1"
3. ✅ Test page can speak Marathi
4. ✅ Main app shows Marathi voice option
5. ✅ Can select and use Marathi voice
6. ✅ Hear Marathi speech in app

---

## 📞 **Still Having Issues?**

### **Collect This Information:**

1. **Windows Version**
   - Press `Win + R`
   - Type `winver`
   - Press Enter
   - Note the version number

2. **Check Language Settings**
   - Take screenshot of language list
   - Take screenshot of Marathi options

3. **Check Test Page**
   - Open `test_marathi_voice.html`
   - Click "List All Voices"
   - Take screenshot

4. **Check Errors**
   - Press F12 in browser
   - Look for error messages
   - Take screenshot

### **Common Solutions:**

- **Windows 10 Home**: May need Windows Update first
- **Windows 10 LTSC**: May not support all languages
- **Windows 7/8**: Not supported, upgrade to Windows 10/11
- **Corrupted Windows**: Run `sfc /scannow` in admin CMD

---

## 🚀 **Quick Start (TL;DR)**

### **Fastest Way:**

1. **Win + I** (Open Settings)
2. **Time & Language** → **Language & Region**
3. **Add a language** → Search **"Marathi"**
4. **Select** Marathi (India)
5. **Next** → ✅ Check **"Text-to-speech"**
6. **Install** → Wait 2-5 minutes
7. **Close browser completely**
8. **Reopen browser**
9. **Test** with `test_marathi_voice.html`
10. **Done!** ✅

---

## 📚 **Additional Resources**

### **Microsoft Documentation:**
- [Add and switch input and display language preferences](https://support.microsoft.com/en-us/windows/manage-the-input-and-display-language-settings-in-windows-12a10cb4-8626-9b77-0ccb-5013e0c7c7a2)

### **Video Tutorials:**
- Search YouTube: "Install Marathi language Windows 11"
- Search YouTube: "Add language pack Windows 10"

---

**Follow Method 1 step-by-step and Marathi voice will be installed!** 📥🔊🇮🇳✨
