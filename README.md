<div align="center">
  <h1>Bloom</h1>

  [Spicetify](https://github.com/khanhas/spicetify-cli) theme inspired by Microsoft's [Fluent Design System](https://www.microsoft.com/design/fluent).  

### **Consider starring us, and suggest stuff by submitting a comment!**

</div>

<br>

![main-cover](https://raw.githubusercontent.com/nimsandu/spicetify-bloom/main/images/bloom_cover.jpg)

<br>

## First Look

<br>

#### **Default Dark**

![dark-1](https://raw.githubusercontent.com/nimsandu/spicetify-bloom/main/images/dark.png)

<br>

#### **Default Light**

![light-1](https://raw.githubusercontent.com/nimsandu/spicetify-bloom/main/images/light.png)

<br>

#### **Dark Mono**

![light-1](https://raw.githubusercontent.com/nimsandu/spicetify-bloom/main/images/darkmono.png)
By [@SunsetTechuila](https://github.com/SunsetTechuila)

<br>

## **LibraryX First Look**

#### **Default Dark**

![Dark-libx](https://github.com/nimsandu/spicetify-bloom/blob/58b8799bfc963c87d97b5eff1cb1faf48f15c5f3/images/libx_dark.jpg)

<br>

#### **Default Light**

![light-libx](https://github.com/nimsandu/spicetify-bloom/blob/58b8799bfc963c87d97b5eff1cb1faf48f15c5f3/images/libx_light.jpg)

<br>

#### **Dark Mono**

![darkmono-libx](https://github.com/nimsandu/spicetify-bloom/blob/58b8799bfc963c87d97b5eff1cb1faf48f15c5f3/images/libx_darkmono.jpg)

<br>

## Dependencies

- Latest version of [Spicetify](https://github.com/spicetify/spicetify-cli).
- Latest version of [Spotify](https://www.spotify.com/download).
- [Segoe UI](https://en.wikipedia.org/wiki/Segoe#Segoe_UI) font family, comes pre-installed on Windows Vista and newer.
  Segoe UI versions older than 5.37 (older than Windows 8.0) are not officially supported but may work.

## Automated Installation

### Windows (Powershell)

```powershell
Invoke-WebRequest -UseBasicParsing "https://raw.githubusercontent.com/nimsandu/spicetify-bloom/main/install/install.ps1" | Invoke-Expression
```

### Linux/macOS (Bash)

```bash
curl -fsSL https://raw.githubusercontent.com/nimsandu/spicetify-bloom/main/install/install.sh | bash
```

<details>
    <summary>Special script for Debian users</summary>
<p>Replace `install.sh` in the above command with `install_debian.sh`. Spotify made a derp that it doesn't work on some Debian installations. Passing `--no-zygote` flag to it will fix this issue, which also means we also need to add it to launcher entry. `install_debian.sh` script's whole purpose is to run the `install.sh` as usual, then applying the fix. Issues about it are welcome!</p>

#### credit [@windowz414](https://github.com/windowz414) for the script

</details>

...or if you don't want to use shell commands, you can download the installation scripts within the repository.

### Spicetify Marketplace

You can also install the theme from the Spicetify Marketplace.
Simply install [spicetify-marketplace](https://github.com/spicetify/spicetify-marketplace) by following it's
[installation instructions](https://github.com/spicetify/spicetify-marketplace/wiki/Installation). Look for `Bloom` theme and install it.

## Manual Installation

Use this guide to install if you're having trouble using the shell commands/installation scripts.

### Step 1

- Download the theme [ZIP file](https://github.com/nimsandu/spicetify-bloom/archive/refs/heads/main.zip) via the GitHub repository page.

### Step 2

- Navigate to the Spicetify's `Themes` directory.

| Platform            | Path                              |
| ------------------- | --------------------------------- |
| **Windows**         | `%appdata%\spicetify\Themes`      |
| **Linux**/**MacOS** | `~/.config/spicetify/Themes`      |

### Step 3

- In the directory, create a new folder called `Bloom`.

### Step 4

- Open the downloaded theme ZIP file, and extract all of the files from the `src` subfolder to the Bloom folder you created.

### Step 5

- Open a terminal/command prompt window and type the following commands:

```bash
spicetify config current_theme Bloom
spicetify config color_scheme dark
```

...and then apply the theme by typing `spicetify apply`. And you should be done!

<br>

If you encounter any buggy artifacts after applying, type these following commands:

```sh
spicetify config inject_css 1
spicetify config replace_colors 1
spicetify config overwrite_assets 1
spicetify config inject_theme_js 1
```

..then type `spicetify apply` to apply the theme.

## Important

For the sidebar playlists to show properly, ensure that these two lines are added in the Patch section of your `config-xpui.ini` file:

```ini
[Patch]
xpui.js_find_8008 = ,(\w+=)32,
xpui.js_repl_8008 = ,${1}56,
```

## Customization

The `dark` color scheme is applied by default during the installation process. If you install Bloom via PowerShell the installed color scheme depends on your Windows settings.

The available color schemes are: `light` `darkmono` and `dark`. Apply one using the following commands:

```
spicetify config color_scheme <color scheme>
spicetify apply
```

Credit for the scheme Dark Mono: [@SunsetTechuila](https://github.com/SunsetTechuila)

### More Options

- You can change the accent color in the theme folder's color.ini file.  
- If you're using Windows, you can hide the window controls by adding the flag `--transparent-window-controls` after Spotify.exe in your Spotify shortcut.  

## Troubleshooting

<details>
  <summary><b>Experiencing issues after installing via Spicetify Marketplace?</b></summary>
<blockquote> If you're experiencing issues after installing the theme via the Spicetify Marketplace, reset it by going to the Spicetify Marketplace settings, then scroll all the way down until you see the "Reset Marketplace" button. After that, proceed to install the theme using the instation methods shown above. </blockquote>
</details>

<details>
  <summary><b>Theme is broken, some visual elements are missing, etc.</b></summary>
<blockquote> Spotify releases updates very frequently, and when that happens, it's common for things to break. Generally, we'll be able to fix these issues, but there are certain issues that are out of our control. If you experience such an issue, please report them via the repository's issues page.
</details>

<details>
  <summary><b>Theme breaks after installing a Spicetify addon/app.</b></summary>
<blockquote> This occurs rather because the custom app doesnt exist. Check Spicetify repositories if it indeed exists in that exact package name and open an issue on this repo if it does for a more extended testing. </blockquote>

#### credit [@windowz414](https://github.com/windowz414) for the troubleshooting

</details>

<details>
  <summary><b>Uninstallation</b></summary>
  <blockquote>uninstallation

  1. Restore Spotify to original state
    ![image](https://user-images.githubusercontent.com/80559769/188782496-a38e4195-089d-4a73-80d7-eb7493db280e.png)

  2. Delete spicetify files in appdata. Local and roaming
    ![image](https://user-images.githubusercontent.com/80559769/188782730-24c13c8a-3264-4fe9-808b-62b6beb0f7d7.png)
    ![image](https://user-images.githubusercontent.com/80559769/188782810-776ce017-de18-449d-b0b3-3523e3d02f45.png)

  3. Use PowerShell to install spicetify and Bloom
    ![image](https://user-images.githubusercontent.com/80559769/188782914-c5e9e66d-de83-4b83-9f35-f2b0d78a062b.png)

  4. Restart and apply to Spotify
    ![image](https://user-images.githubusercontent.com/80559769/188783021-dd9e683a-c433-4d42-975a-e3c685d75f96.png)

#### credit [@Georgetheasian](https://github.com/Georgetheasian) for the uninstallation guide

 </details>

## If you uninstall Bloom let us know how to shape our future

## Credits

- Based on [Fluent](https://github.com/williamckha/spicetify-fluent) by [williamckha](https://github.com/williamckha)  
- [Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons) by Microsoft Corporation  
- [Phosphor Icons](https://github.com/phosphor-icons/phosphor-icons) by Phosphor Icons
- For the scheme *Dark Mono*: [@SunsetTechuila](https://github.com/SunsetTechuila)

## Special Thanks

- @ohitstom [Thomas Fitzpatrick](https://github.com/ohitstom) for implementing the new theme script feature
- @Dilith-Dahanayake [Milky](https://github.com/Dilith-Dahanayake) for beta testing

#### To appreciate your sacrifice of time and long-term dedication

- @kyrie25 [Nam Anh](https://github.com/kyrie25)
- @windowz414 [Beru Hinode](https://github.com/windowz414)
- @SunsetTechuila [Sunset](https://github.com/SunsetTechuila)

#### And For Every Contributor, stargazer and Bloomer

## License

[MIT License](LICENSE)
