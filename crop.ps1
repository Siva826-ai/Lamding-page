[Reflection.Assembly]::LoadWithPartialName("System.Drawing") | Out-Null

$src = "c:\Users\ASUS\Landing page\assets\images\target_ui_ref.png"
$img = [System.Drawing.Image]::FromFile($src)

$w = $img.Width
$h = $img.Height
Write-Host "Image size: $w x $h"

# Crop Master Layout (Card 1)
# Approx x: 79% to 96%, y: 21% to 52%
$x1 = [int]($w * 0.792)
$y1 = [int]($h * 0.215)
$w1 = [int]($w * 0.168)
$h1 = [int]($h * 0.305)

$rect1 = New-Object System.Drawing.Rectangle $x1, $y1, $w1, $h1
$bmp1 = New-Object System.Drawing.Bitmap $w1, $h1
$g1 = [System.Drawing.Graphics]::FromImage($bmp1)
$g1.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $w1, $h1), $rect1, [System.Drawing.GraphicsUnit]::Pixel)
$g1.Dispose()
$bmp1.Save("c:\Users\ASUS\Landing page\assets\images\master_layout.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp1.Dispose()

# Crop Keyplan (Card 2)
# Approx x: 79% to 96%, y: 53.5% to 79%
$x2 = [int]($w * 0.792)
$y2 = [int]($h * 0.535)
$w2 = [int]($w * 0.168)
$h2 = [int]($h * 0.255)

$rect2 = New-Object System.Drawing.Rectangle $x2, $y2, $w2, $h2
$bmp2 = New-Object System.Drawing.Bitmap $w2, $h2
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $w2, $h2), $rect2, [System.Drawing.GraphicsUnit]::Pixel)
$g2.Dispose()
$bmp2.Save("c:\Users\ASUS\Landing page\assets\images\keyplan.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp2.Dispose()

$img.Dispose()
Write-Host "Cropping finished successfully!"
