import { filter, interval, Observable, ReplaySubject, take } from 'rxjs';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as monaco from "monaco-editor";

@Component({
  selector: 'user-editor',
  imports: [CommonModule],
  templateUrl: './user-editor.component.html',
  styleUrl: './user-editor.component.scss',
})
export class UserEditorComponent {
  private editor?: monaco.editor.IStandaloneCodeEditor; // editor instance to e.g. read value by this.editor.getValue()

  getEditor() {
    return this.editor;
  }

  @ViewChild('editorContainer', { static: true }) set editorContainer(container: ElementRef<HTMLDivElement>) {
    this.loadMonacoScripts().subscribe((monaco) => {
      monaco.languages.register({ id: 'sngFile' });
      monaco.languages.setMonarchTokensProvider('sngFile', {
        tokenizer: {
          root: [
            [/^[Uu][Nn][Bb][Ee][Kk][Aa][Nn][Nn][Tt](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'unbekannt'],
            [/^[Uu][Nn][Bb][Ee][Nn][Aa][Nn][Nn][Tt](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'unbenannt'],
            [/^[Uu][Nn][Kk][Nn][Oo][Ww][Nn](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'unknown'],
            [/^[Ii][Nn][Tt][Rr][Oo](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'intro'],
            [/^[Vv][Ee][Rr][Ss](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'vers'],
            [/^[Vv][Ee][Rr][Ss][Ee](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'verse'],
            [/^[Ss][Tt][Rr][Oo][Pp][Hh][Ee](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'strophe'],
            [/^[Pp][Rr][Ee]-[Bb][Rr][Ii][Dd][Gg][Ee](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'pre-bridge'],
            [/^[Bb][Rr][Ii][Dd][Gg][Ee](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'bridge'],
            [/^[Mm][Ii][Ss][Cc](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'misc'],
            [/^[Pp][Rr][Ee]-[Rr][Ee][Ff][Rr][Aa][Ii][Nn](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'pre-refrain'],
            [/^[Rr][Ee][Ff][Rr][Aa][Ii][Nn](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'refrain'],
            [/^[Pp][Rr][Ee]-[Cc][Hh][Oo][Rr][Uu][Ss](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'pre-chorus'],
            [/^[Cc][Hh][Oo][Rr][Uu][Ss](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'chorus'],
            [/^[Pp][Rr][Ee]-[Cc][Oo][Dd][Aa](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'pre-coda'],
            [/^[Cc][Oo][Dd][Aa](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'coda'],
            [/^[Zz][Ww][Ii][Ss][Cc][Hh][Ee][Nn][Ss][Pp][Ii][Ee][Ll](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'zwischenspiel'],
            [/^[Ii][Nn][Tt][Ee][Rr][Ll][Uu][Dd][Ee](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'interlude'],
            [/^[Ii][Nn][Ss][Tt][Rr][Uu][Mm][Ee][Nn][Tt][Aa][Ll](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'instrumental'],
            [/^[Ee][Nn][Dd][Ii][Nn][Gg](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'ending'],
            [/^[Ee][Nn][Dd][Ee](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'ende'],
            [/^[Oo][Uu][Tt][Rr][Oo](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'outro'],
            [/^[Tt][Ee][Ii][Ll](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'teil'],
            [/^[Pp][Aa][Rr][Tt](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'part'],
            [/^[Cc][Hh][Oo][Rr](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'chor'],
            [/^[Ss][Oo][Ll][Oo](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'solo'],
            [/^[Bb][Rr][Ee][Aa][Kk][Dd][Oo][Ww][Nn](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'breakdown'],
            [/^[Vv][Aa][Mm][Pp](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'vamp'],
            [/^[Tt][Uu][Rr][Nn][Aa][Rr][Oo][Uu][Nn][Dd](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'turnaround'],
            [/^[Tt][Aa][Gg](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'tag'],
            [/^[Aa][Nn][Dd][Ee][Rr][Ee](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'andere'],
            [/^[Cc][Oo][Pp][Yy][Rr][Ii][Gg][Hh][Tt](?:(?: (?:[A-Z0-9][0-9a-z]*))?| +)$/m, 'copyright'],
            [/^---?-?$/m, 'hyphens'],
          ]
        }
      });
      /* TODO: https://github.com/microsoft/monaco-editor/issues/4462
      monaco.editor.defineTheme('sngTheme', {
        rules: [
          { token: 'unbekannt', background: '5DBCD2', foreground: 'FFFFFF' },
          { token: 'unbenannt', background: '5DBCD2', foreground: 'FFFFFF' },
          { token: 'unknown', background: '5DBCD2', foreground: 'FFFFFF' },
          { token: 'vers', background: '0080FF', foreground: 'FFFFFF' },
          { token: 'verse', background: '0080FF', foreground: 'FFFFFF' },
          { token: 'strophe', background: '0080FF', foreground: 'FFFFFF' },
          { token: 'pre-bridge', background: 'AA55FF', foreground: 'FFFFFF' },
          { token: 'bridge', background: 'CC0000', foreground: 'FFFFFF' },
          { token: 'misc', background: 'CC0000', foreground: 'FFFFFF' },
          { token: 'pre-refrain', background: 'AA55FF', foreground: 'FFFFFF' },
          { token: 'refrain', background: '8000FF', foreground: 'FFFFFF' },
          { token: 'pre-chorus', background: 'AA55FF', foreground: 'FFFFFF' },
          { token: 'chorus', background: '8000FF', foreground: 'FFFFFF' },
          { token: 'pre-coda', background: 'AA55FF', foreground: 'FFFFFF' },
          { token: 'coda', background: '008040', foreground: 'FFFFFF' },
          { token: 'zwischenspiel', background: 'CC0000', foreground: 'FFFFFF' },
          { token: 'interlude', background: 'CC0000', foreground: 'FFFFFF' },
          { token: 'instrumental', background: 'CC0000', foreground: 'FFFFFF' },
          { token: 'ending', background: '008040', foreground: 'FFFFFF' },
          { token: 'ende', background: '008040', foreground: 'FFFFFF' },
          { token: 'outro', background: '008040', foreground: 'FFFFFF' },
          { token: 'teil', background: '0080FF', foreground: 'FFFFFF' },
          { token: 'part', background: '0080FF', foreground: 'FFFFFF' },
          { token: 'chor', background: 'AAB0FF', foreground: 'FFFFFF' },
          { token: 'solo', background: 'AAB0FF', foreground: 'FFFFFF' },
          { token: 'breakdown', background: '008040', foreground: 'FFFFFF' },
          { token: 'vamp', background: '008040', foreground: 'FFFFFF' },
          { token: 'turnaround', background: 'CC0000', foreground: 'FFFFFF' },
          { token: 'tag', background: 'CC0000', foreground: 'FFFFFF' },
          { token: 'andere', background: 'CC0000', foreground: 'FFFFFF' },
          { token: 'copyright', background: 'FFFF00', foreground: 'FFFFFF' },
          { token: 'hyphens', foreground: 'CC0000' },
        ],
        colors: {},
        base: 'vs-dark',
        inherit: true
      });*/
      // TODO: Until https://github.com/microsoft/monaco-editor/issues/4462 is solved, I'm gonna use the below defineTheme call
      monaco.editor.defineTheme('sngTheme', {
        rules: [
          { token: 'unbekannt', foreground: '5DBCD2' },
          { token: 'unbenannt', foreground: '5DBCD2' },
          { token: 'unknown', foreground: '5DBCD2' },
          { token: 'vers', foreground: '0080FF' },
          { token: 'verse', foreground: '0080FF' },
          { token: 'strophe', foreground: '0080FF' },
          { token: 'pre-bridge', foreground: 'AA55FF' },
          { token: 'bridge', foreground: 'CC0000' },
          { token: 'misc', foreground: 'CC0000' },
          { token: 'pre-refrain', foreground: 'AA55FF' },
          { token: 'refrain', foreground: '8000FF' },
          { token: 'pre-chorus', foreground: 'AA55FF' },
          { token: 'chorus', foreground: '8000FF' },
          { token: 'pre-coda', foreground: 'AA55FF' },
          { token: 'coda', foreground: '008040' },
          { token: 'zwischenspiel', foreground: 'CC0000' },
          { token: 'interlude', foreground: 'CC0000' },
          { token: 'instrumental', foreground: 'CC0000' },
          { token: 'ending', foreground: '008040' },
          { token: 'ende', foreground: '008040' },
          { token: 'outro', foreground: '008040' },
          { token: 'teil', foreground: '0080FF' },
          { token: 'part', foreground: '0080FF' },
          { token: 'chor', foreground: 'AAB0FF' },
          { token: 'solo', foreground: 'AAB0FF' },
          { token: 'breakdown', foreground: '008040' },
          { token: 'vamp', foreground: '008040' },
          { token: 'turnaround', foreground: 'CC0000' },
          { token: 'tag', foreground: 'CC0000' },
          { token: 'andere', foreground: 'CC0000' },
          { token: 'copyright', foreground: 'FFFF00' },
          { token: 'hyphens', foreground: 'CC0000' },
        ],
        colors: {},
        base: 'vs-dark',
        inherit: true
      });
      this.editor = monaco.editor.create(container.nativeElement, {
        value: 'Alice has 666 keys\n',
        language: 'sngFile',
        theme: 'sngTheme'
      });
    })
  }

  private loadMonacoScripts(): Observable<typeof monaco> {
    const loader = new ReplaySubject<typeof monaco>(1);
    if ((window as any).monacoEditorLoading) {
      interval(200)
        .pipe(filter((_) => (window as any).monaco), take(1))
        .subscribe((_) => {
          loader.next((window as any).monaco);
          loader.complete();
        });
      return loader;
    }
    (window as any).monacoEditorLoading = true;
    const script = document.createElement('script');
    script.src = '/assets/lib/monaco-editor/min/vs/loader.js';
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      (window as any).require.config({ paths: { vs: '/assets/lib/monaco-editor/min/vs' }});
      (window as any).require(['vs/editor/editor.main'], () => {
        loader.next((window as any).monaco);
        loader.complete();
      });
    };
    document.body.appendChild(script);
    return loader;
  }
}
