import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { UserEditorComponent } from './user-editor/user-editor.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, UserEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title: string = 'SNGMaker';
  // https://gitlab.com/openlp/wiki/-/wikis/Development/SongBeamer_-_Song_Data_Format
  properties: {name: string, label: string, value: string}[] = [
    { name: 'title', label: 'Title:', value: ''},
    { name: 'author', label: 'Author:', value: ''},
    { name: 'melody', label: 'Melody:', value: ''},
    { name: 'translation', label: 'Translation:', value: ''},
    { name: 'copyright', label: 'Copyright information:', value: ''},
    { name: 'natCopyright', label: 'National copyright information:', value: ''},
    { name: 'rights', label: 'Additional rights:', value: ''},
    { name: 'addCopyrightInfo', label: 'Additional copyright information:', value: ''},
    { name: 'ccli', label: 'CCLI:', value: ''},
    { name: 'editor', label: 'Editor:', value: ''},
    { name: 'bible', label: 'Bible:', value: ''},
    { name: 'categories', label: 'Categories:', value: ''},
    { name: 'keywords', label: 'Keywords:', value: ''},
    { name: 'quickFind', label: 'Quick find:', value: ''},
    { name: 'churchSongId', label: 'internal ID:', value: ''},
    { name: 'comment', label: 'Comment:', value: ''},
    { name: 'comments', label: 'Comments:', value: ''},
    { name: 'chords', label: 'Chords', value: ''},
    { name: 'key', label: 'Key:', value: ''},
    { name: 'verseOrder', label: 'Verse order:', value: ''},
    { name: 'songbook', label: 'Songbook:', value: ''},
    { name: 'langCount', label: 'Language count:', value: ''},
    { name: 'lang', label: 'Language:', value: ''},
    { name: 'tempo', label: 'Tempo:', value: ''},
    { name: 'oTitle', label: 'Original title:', value: ''},
    { name: 'backgroundImage', label: 'Background image:', value: ''},
    { name: 'font', label: 'Font:', value: ''},
    { name: 'fontSize', label: 'Font size:', value: ''},
    { name: 'textAlign', label: 'Text alignment:', value: ''},
    { name: 'titleAlign', label: 'Title alignment:', value: ''},
    { name: 'version', label: 'Version:', value: '3'},
  ];

  @ViewChild('monacoEditor') monacoEditor!: UserEditorComponent;

  getSngFilePropertyName(propertyName: string) {
    switch(propertyName) {
      case 'title': return 'Title';
      case 'author': return 'Author';
      case 'melody': return 'Melody';
      case 'translation': return 'Translation';
      case 'copyright': return '(c)';
      case 'natCopyright': return 'NatCopyright';
      case 'rights': return 'Rights';
      case 'addCopyrightInfo': return 'AddCopyrightInfo';
      case 'ccli': return 'CCLI';
      case 'editor': return 'Editor';
      case 'bible': return 'Bible';
      case 'categories': return 'Categories';
      case 'keywords': return 'Keywords';
      case 'quickFind': return 'QuickFind';
      case 'churchSongId': return 'ChurchSongID';
      case 'comment': return 'Comment';
      case 'comments': return 'Comments';
      case 'chords': return 'Chords';
      case 'key': return 'Key';
      case 'verseOrder': return 'VerseOrder';
      case 'songbook': return 'Songbook';
      case 'langCount': return 'LangCount';
      case 'lang': return 'Lang';
      case 'tempo': return 'Tempo';
      case 'oTitle': return 'OTitle';
      case 'backgroundImage': return 'BackgroundImage';
      case 'font': return 'Font';
      case 'fontSize': return 'FontSize';
      case 'textAlign': return 'TextAlign';
      case 'titleAlign': return 'TitleAlign';
      case 'version': return 'Version';
      default: return null;
    }
  }

  getSngFileContent(): string | null {
    let sngContent = '';
    for (const property of this.properties) {
      if (property.value.trim() != '') {
        sngContent += `#${this.getSngFilePropertyName(property.name)}=${property.value}\n`;
      }
    }
    if (!sngContent || sngContent.trim() == '') return null;
    return `${sngContent}---\n`;
  }

  copy() {
    const str = this.monacoEditor.getEditor()?.getValue();
    if (!str) return; // Don't need to copy if there is nothing to copy
    let sngFileContent = this.getSngFileContent();
    if (sngFileContent) sngFileContent += str;
    else sngFileContent = str;
    navigator.clipboard.writeText(sngFileContent);
  }

  save() {
    const str = this.monacoEditor.getEditor()?.getValue();
    if (!str) return; // Don't need to copy if there is nothing to copy
    let sngFileContent = this.getSngFileContent();
    if (sngFileContent) sngFileContent += str;
    else sngFileContent = str;
    const file = new Blob([sngFileContent], { type: 'text/sng' });
    const downloadAncher = document.createElement('a');
    downloadAncher.style.display = "none";
    const fileUrl = URL.createObjectURL(file);
    downloadAncher.href = fileUrl;
    const titleProperty = this.properties.find((entry) => entry.name == 'title');
    downloadAncher.download = titleProperty && titleProperty.value.trim() != '' ? titleProperty.value : 'sngFile.sng';
    if (downloadAncher.download != 'sngFile.sng') downloadAncher.download = downloadAncher.download + '.sng';
    downloadAncher.click();
  }
}
